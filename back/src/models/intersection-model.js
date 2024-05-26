const knex = require("../../config/knex.config");
const intersectionTable = "intersections",
  targetsTable = "targets",
  coworkingsTable = "coworkings";

const intersectionFields = [
  "intersections.id",
  "intersections.location",
  "intersections.frequency",
  "intersections.type",
  "intersections.user_id",
  "intersections.distance",
  "intersections.firstcow_id",
  "intersections.secondcow_id",
  "intersections.description",
  "intersections.created_at",
  "intersections.updated_at",
];

const targetsFields = [
  "targets.id",
  "targets.coworking_id",
  "targets.another_coworking",
  "targets.azimuth_degrees",
  "targets.type",
  "targets.distance",
  "targets.frequency",
  "targets.description",
  "targets.user_id",
  "targets.created_at",
  "targets.updated_at",
];

const coworkingsFields = [
  "coworkings.id as coworking_id",
  "coworkings.coworking_name",
  "coworkings.address",
  "coworkings.location",
];

const conditionHandlers = {
  id: (query, value) => query.where("id", value),
  coworking_id: (query, value) => query.where("coworking_id", value),
  another_coworking: (query, value) => query.where("another_coworking", value),
  user_id: (query, value) => query.where("user_id", value),
  type: (query, value) => query.where("type", value),
  frequency: (query, value) => query.where("frequency", value),
};

module.exports = {
  async createOrUpdateTarget(payload) {
    const { coworking_id } = payload;
    try {
      const existingTarget = await knex(targetsTable)
        .where({ coworking_id })
        .first();

      if (existingTarget) {
        const [result] = await knex(targetsTable)
          .where({ coworking_id })
          .update({ ...payload, updated_at: knex.fn.now() })
          .returning("*");
        return result;
      } else {
        const [result] = await knex(targetsTable)
          .insert(payload)
          .returning("*");
        return result;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getTargetsByCondition(condition = {}) {
    try {
      const targetsQuery = knex(targetsTable).select(targetsFields);

      if (condition["user_id"]) {
        targetsQuery.where("targets.user_id", condition["user_id"]);
        delete condition["user_id"];
      }

      for (const [key, value] of Object.entries(condition)) {
        const handler = conditionHandlers[key];
        if (handler) {
          handler(targetsQuery, value);
        } else {
          targetsQuery.where(key, value);
        }
      }

      return await targetsQuery;
    } catch (error) {
      console.error("Error fetching targets by condition:", error.message);
      throw error;
    }
  },

  async getCoworkingsWithTargetsByCondition(condition = {}) {
    try {
      const targetsQuery = knex(targetsTable)
        .select(targetsFields)
        .rightJoin(coworkingsTable, "targets.coworking_id", "coworkings.id")
        .select([
          ...coworkingsFields,
          ...targetsFields,
          knex.raw("ST_AsEWKT(location) as location"),
        ]);

      if (condition["user_id"]) {
        targetsQuery.where("coworkings.user_id", condition["user_id"]);
        delete condition["user_id"];
      }

      for (const [key, value] of Object.entries(condition)) {
        const handler = conditionHandlers[key];
        if (handler) {
          handler(targetsQuery, value);
        } else {
          targetsQuery.where(key, value);
        }
      }

      return await targetsQuery;
    } catch (error) {
      console.error("Error fetching targets by condition:", error.message);
      throw error;
    }
  },

  async removeTargetsByCondition(condition = {}) {
    try {
      const targetsQuery = knex(targetsTable);
      if (condition.id) {
        targetsQuery.where("targets.id", condition.id);
        delete condition.id;
      }
      if (condition.coworking_id) {
        targetsQuery.where("targets.coworking_id", condition.coworking_id);
        delete condition.coworking_id;
      }
      if (condition.user_id) {
        targetsQuery.where("targets.user_id", condition.user_id);
        delete condition.user_id;
      }
      const result = await targetsQuery.delete();
      if (result) return { message: "Target(s) deleted successfully" };
      else return { message: "Ціль вже було  видалено" };
    } catch (error) {
      console.error("Error deleting targets by condition:", error.message);
      throw error;
    }
  },

  async createIntersectionPoint(queryParametrs, payload) {
    const trx = await knex.transaction();
    try {
      const intersectionResult = await await trx.raw(
        `SELECT
                        ST_AsText(ST_Intersection(
                            ST_MakeLine(
                                ST_SetSRID(ST_MakePoint(?, ?), 4326),
                                ST_SetSRID(ST_MakePoint(?, ?), 4326)
                            ),
                            ST_MakeLine(
                                ST_SetSRID(ST_MakePoint(?, ?), 4326),
                                ST_SetSRID(ST_MakePoint(?, ?), 4326)
                            )
                        )) AS intersection_point
                    `,
        queryParametrs,
      );

      const intersectionPointWKT =
        intersectionResult.rows[0].intersection_point;

      if (
        !intersectionPointWKT ||
        intersectionPointWKT === "LINESTRING EMPTY"
      ) {
        throw new Error("Точка перетину не знайдена");
      }

      const intersectionData = {
        location: trx.raw(`ST_GeomFromText(?, 4326)::geography`, [
          intersectionPointWKT,
        ]),
        frequency: payload.frequency,
        type: payload.type || "unknown",
        user_id: payload.userId,
        distance: payload.distance,
        firstcow_id: payload.firstCowId,
        secondcow_id: payload.secondCowId,
        description: payload.description || null,
      };

      const [intersectionId] = await trx(intersectionTable)
        .insert(intersectionData)
        .returning("id");

      await trx.commit();

      return {
        intersectionId,
        intersectionPoint: intersectionPointWKT,
        intersectionData,
      };
    } catch (error) {
      await trx.rollback();
      console.error(error);
      throw error;
    }
  },

  async getIntersectionsByCondition(condition = {}) {
    try {
      const intersectionsQuery = knex(intersectionTable).select([
        ...intersectionFields,
        knex.raw("ST_AsEWKT(location) as location"),
      ]);

      if (condition["user_id"]) {
        intersectionsQuery.where("intersections.user_id", condition["user_id"]);
        delete condition["user_id"];
      }

      if (condition.coworking_id) {
        const coworkingId = condition.coworking_id;
        intersectionsQuery.where(function () {
          this.where("intersections.firstcow_id", coworkingId).orWhere(
            "intersections.secondcow_id",
            coworkingId,
          );
        });
        delete condition.coworking_id;
      }

      for (const [key, value] of Object.entries(condition)) {
        const handler = conditionHandlers[key];
        if (handler) {
          handler(intersectionsQuery, value);
        } else {
          intersectionsQuery.where(key, value);
        }
      }

      return await intersectionsQuery;
    } catch (error) {
      console.error(
        "Error fetching intersections by condition:",
        error.message,
      );
      throw error;
    }
  },

  async clearIntersectionsByCondition(condition = {}) {
    try {
      const intersectionsQuery = knex(intersectionTable);

      if (condition.user_id) {
        intersectionsQuery.where("intersections.user_id", condition.user_id);
        delete condition.user_id;
      }

      if (condition.coworking_id) {
        const coworkingId = condition.coworking_id;
        intersectionsQuery.where(function () {
          this.where("intersections.firstcow_id", coworkingId).orWhere(
            "intersections.secondcow_id",
            coworkingId,
          );
        });
        delete condition.coworking_id;
      }

      for (const [key, value] of Object.entries(condition)) {
        const handler = conditionHandlers[key];
        if (handler) {
          handler(intersectionsQuery, value);
        } else {
          intersectionsQuery.where(key, value);
        }
      }

      const result = await intersectionsQuery.delete();

      return result;
    } catch (error) {
      console.error(
        "Error deleting intersections by condition:",
        error.message,
      );
      throw error;
    }
  },
};
