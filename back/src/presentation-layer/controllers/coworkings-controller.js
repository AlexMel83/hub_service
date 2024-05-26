const coworkingModel = require("../../models/coworking-model");
const GisService = require("../../services/gis-service");
const ApiError = require("../../exceptions/api-errors");
class CoworkingsController {
  async getCoworkings(req, res) {
    try {
      let response;
      if (req?.query?.name) {
        const name = req.query.name;
        response = await coworkingModel.getCoworkingsByName(name);
      } else if (req?.query?.id) {
        const id = req.query.id;
        response = await coworkingModel.getOneCoworkingById(id);
      } else if (req?.query.user_id) {
        const user_id = req.query.user_id;
        response = await coworkingModel.getCoworkingsByUser(user_id);
      } else {
        response = await coworkingModel.getCoworkings();
      }
      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }

  async addCoworking(req, res) {
    const user = req.user;
    req.body.user_id = user.id;
    const fields = req.body;
    fields.coworking_photo = req.file ? req.file.path : "";

    try {
      if (fields.address) {
        const geocodeResult = await GisService.geocodeAddress(fields.address);
        fields.location = geocodeResult.location;
        fields.formatted_address = geocodeResult.formattedAddress;
      }
      const coworking = await coworkingModel.addCoworking(fields);
      return res.status(200).json(coworking);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }

  async removeCoworking(req, res) {
    const user = req.user;
    const id = req.query.id;
    try {
      let response;
      const coworking = await coworkingModel.getOneCoworkingById(id);
      if (!coworking) {
        return res.send(ApiError.NotFound(`id: ${id} was not found`));
      }
      if (
        user.role === "admin" ||
        (user.role === "manager" && user.id === coworking.user_id)
      ) {
        response = await coworkingModel.removeCoworking(coworking.id);
      } else {
        res.send(ApiError.AccessDeniedForRole("User not owner"));
      }
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }

  async updateCoworking(req, res) {
    const user = req.user;
    const fields = req.body;

    if (req.file) {
      fields.coworking_photo = req.file.path;
    }

    try {
      if (fields.address) {
        const geocodeResult = await GisService.geocodeAddress(fields.address);
        fields.location = geocodeResult.location;
        fields.formatted_address = geocodeResult.formattedAddress;
      }
      let updatedCoworking;
      const coworking = await coworkingModel.getOneCoworkingById(fields.id);
      if (coworking.length === 0) {
        return res.json(ApiError.NotFound(`id: ${fields.id} was not found`));
      }
      if (
        fields.coworking_photo === undefined &&
        coworking.coworking_photo !== undefined
      ) {
        fields.coworking_photo = coworking.coworking_photo;
      }

      if (
        user.role === "admin" ||
        (user.role === "manager" && user.id === coworking.user_id)
      ) {
        fields.user_id = coworking.user_id;
        updatedCoworking = await coworkingModel.updateCoworking(fields);
      } else {
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
      return res.status(200).json(updatedCoworking);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }
}

module.exports = new CoworkingsController();
