const ApiError = require("../../exceptions/api-errors");
const coworkingModel = require("../../models/coworking-model");
const intersectionModel = require("../../models/intersection-model");

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function extractCoordinatesFromWKT(wktString) {
  if (!wktString) {
    console.error("WKT-строки відсутні!");
    return [undefined, undefined];
  }

  const coordinatesPart = wktString.match(/\(([^)]+)\)/);
  if (!coordinatesPart) {
    console.error("Некоректна WKT-строка:", wktString);
    return [undefined, undefined];
  }

  const coords = coordinatesPart[1].split(" ");
  return [parseFloat(coords[0]), parseFloat(coords[1])];
}

function calculateEndPoint(lon, lat, distance, azimuth) {
  const R = 6371000; // Радіус Землі в метрах
  const brng = azimuth;
  const d = distance;

  const lat1 = degreesToRadians(lat);
  const lon1 = degreesToRadians(lon);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d / R) +
      Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
      Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2),
    );

  return [
    parseFloat(((lon2 * 180) / Math.PI).toFixed(6)),
    parseFloat(((lat2 * 180) / Math.PI).toFixed(6)),
  ];
}

function extractCoordinates(wkt) {
  const coordinates = wkt
    .substring(wkt.indexOf("(") + 1, wkt.indexOf(")"))
    .split(" ");
  return [parseFloat(coordinates[0]), parseFloat(coordinates[1])];
}

const queryMappings = {
  userId: "user_id",
  id: "id",
  coworkingId: "coworking_id",
  anotherCoworkingId: "another_coworking",
  frequency: "frequency",
  type: "type",
};

module.exports = {
  async createOrUpdateTarget(req, res) {
    const userId = req.user?.id;
    if (!userId) return res.json(ApiError.NotFound("user not was authorized"));
    const {
      coworkingId,
      anotherCoworkingId,
      azimuthDegrees,
      distance,
      type,
      frequency,
      description,
    } = req.body;

    const payload = {
      user_id: userId,
      coworking_id: coworkingId,
      another_coworking: anotherCoworkingId,
      azimuth_degrees: azimuthDegrees,
      distance,
      type,
      frequency,
      description,
    };

    try {
      const result = await intersectionModel.createOrUpdateTarget(payload);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError({ error: error.message }));
    }
  },

  async getTargets(req, res) {
    const { startDate, endDate, ...otherQueryParams } = req.query;
    let condition = {};
    if (req.user.role !== "admin") condition.user_id = req.user.id;
    let response;
    if (startDate && endDate) {
      response = await intersectionModel.getTargetsByCondition(
        startDate,
        endDate,
      );
    } else {
      for (const key in otherQueryParams) {
        const mappedKey = queryMappings[key];
        if (mappedKey) {
          condition[mappedKey] = otherQueryParams[key];
        }
      }
      response = await intersectionModel.getTargetsByCondition(condition);
    }
    if (!response || (otherQueryParams.id && response.length === 0)) {
      return res.json(ApiError.NotFound("Target(s) not found"));
    }

    return res.json(response);
  },

  async getCoworkingWithTargets(req, res) {
    const { startDate, endDate, ...otherQueryParams } = req.query;
    let condition = {};
    let response;
    if (startDate && endDate) {
      response = await intersectionModel.getTargetsByCondition(
        startDate,
        endDate,
      );
    } else {
      for (const key in otherQueryParams) {
        const mappedKey = queryMappings[key];
        if (mappedKey) {
          condition[mappedKey] = otherQueryParams[key];
        }
      }
      response =
        await intersectionModel.getCoworkingsWithTargetsByCondition(condition);
    }
    if (!response || (otherQueryParams.id && response.length === 0)) {
      return res.json(ApiError.NotFound("Coworking(s) not found"));
    }

    return res.json(response);
  },

  async removeTarget(req, res) {
    const { coworkingId, id } = req.query;
    let condition = {};
    if (req.user.role !== "admin") condition.user_id = req.user.id;
    let response;
    if (coworkingId) condition.coworking_id = coworkingId;
    else if (id) condition.id = id;
    else return res.json(ApiError.BadRequest("parametr is empty"));
    response = await intersectionModel.removeTargetsByCondition(condition);
    if (!response) res.json(ApiError.BadRequest("remove target(s) failed"));
    return res.json(response);
  },

  async createIntersection(req, res) {
    const userId = req.user?.id;
    const {
      firstCowId,
      secondCowId,
      firstAngle,
      secondAngle,
      distance,
      type,
      frequency,
      description,
    } = req.body;

    const firstAzimuth = degreesToRadians(firstAngle);
    const secondAzimuth = degreesToRadians(secondAngle);

    const firstCoworking = await coworkingModel.getOneCoworkingById(firstCowId);
    const secondCoworking =
      await coworkingModel.getOneCoworkingById(secondCowId);

    const [firstLongitude, firstLatitude] = extractCoordinatesFromWKT(
      firstCoworking.location,
    );
    const [secondLongitude, secondLatitude] = extractCoordinatesFromWKT(
      secondCoworking.location,
    );

    if (
      firstLongitude === undefined ||
      firstLatitude === undefined ||
      secondLongitude === undefined ||
      secondLatitude === undefined
    ) {
      return res.json(
        ApiError.IntServError({
          error: "Помилка при разборі координат з WKT-строк.",
        }),
      );
    }

    // Calculate end points manually
    const [firstVectorEndLongitude, firstVectorEndLatitude] = calculateEndPoint(
      firstLongitude,
      firstLatitude,
      distance,
      firstAzimuth,
    );
    const [secondVectorEndLongitude, secondVectorEndLatitude] =
      calculateEndPoint(
        secondLongitude,
        secondLatitude,
        distance,
        secondAzimuth,
      );

    const queryParametrs = [
      firstLongitude,
      firstLatitude,
      firstVectorEndLongitude,
      firstVectorEndLatitude,
      secondLongitude,
      secondLatitude,
      secondVectorEndLongitude,
      secondVectorEndLatitude,
    ];

    const payload = {
      userId: userId,
      frequency: frequency,
      type: type,
      firstCowId: firstCowId,
      secondCowId: secondCowId,
      distance: distance,
      description: description,
    };

    try {
      const result = await intersectionModel.createIntersectionPoint(
        queryParametrs,
        payload,
      );

      const intersectionPointWKT = result.intersectionPoint;

      const [longitude, latitude] = extractCoordinates(intersectionPointWKT);

      // Create GeoJSON response
      const geoJson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            properties: {},
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [firstLongitude, firstLatitude],
                [firstVectorEndLongitude, firstVectorEndLatitude],
              ],
            },
            properties: { description: "First Vector" },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [secondLongitude, secondLatitude],
                [secondVectorEndLongitude, secondVectorEndLatitude],
              ],
            },
            properties: { description: "Second Vector" },
          },
        ],
      };

      return res.json(geoJson);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error));
    }
  },

  async getIntersections(req, res) {
    const { startDate, endDate, ...otherQueryParams } = req.query;
    let condition = {};
    if (req.user.role !== "admin") condition.user_id = req.user.id;
    let response;
    if (startDate && endDate) {
      response = await intersectionModel.getIntersectionsByCondition(
        startDate,
        endDate,
      );
    } else {
      for (const key in otherQueryParams) {
        const mappedKey = queryMappings[key];
        if (mappedKey) {
          condition[mappedKey] = otherQueryParams[key];
        }
      }
      response = await intersectionModel.getIntersectionsByCondition(condition);
    }
    if (!response || (otherQueryParams.id && response.length === 0)) {
      return res.json(ApiError.NotFound("Intersection(s) not found"));
    }

    return res.json(response);
  },

  async clearIntersections(req, res) {
    const { startDate, endDate, ...otherQueryParams } = req.query;
    let condition = {};
    if (req.user.role !== "admin") condition.user_id = req.user.id;
    let response;
    if (startDate && endDate) {
      response = await intersectionModel.clearIntersectionsByCondition(
        startDate,
        endDate,
      );
    } else {
      for (const key in otherQueryParams) {
        const mappedKey = queryMappings[key];
        if (mappedKey) {
          condition[mappedKey] = otherQueryParams[key];
        }
      }
      response =
        await intersectionModel.clearIntersectionsByCondition(condition);
    }
    if (!response || (otherQueryParams.id && response.length === 0)) {
      return res.json(
        ApiError.NotFound("Intersection(s) for deleting not found"),
      );
    }
    return res.json("Intersection(s) deleted succesfuly");
  },
};
