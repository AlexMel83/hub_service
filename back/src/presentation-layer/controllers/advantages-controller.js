const advantageModel = require("../../models/advantage-model");
const ApiError = require("../../exceptions/api-errors");

class AdvantagesController {
  async getAdvantages(req, res) {
    try {
      let response;
      if (req?.query?.id) {
        const id = req.query.id;
        response = await advantageModel.getOneAdvantageById(id);
      } else if (req?.query.coworking_id) {
        const coworking_id = req.query.coworking_id;
        response =
          await advantageModel.getAdvantagesByCoworkingId(coworking_id);
      } else {
        response = await advantageModel.getAdvantages();
      }
      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }

  async addAdvantage(req, res) {
    const role = req.user.role;
    const fields = req.body;
    if (req.file) {
      fields.icon = req.file.path;
    }

    try {
      if (role === "admin") {
        const advantage = await advantageModel.addAdvantage(fields);
        return res.status(200).json(advantage);
      } else {
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }

  async updateAdvantage(req, res) {
    const role = req.user.role;
    const fields = req.body;
    if (req.file) {
      fields.icon = req.file.path;
    }

    try {
      if (role === "admin") {
        const advantage = await advantageModel.updateAdvantage(fields);
        return res.status(200).json(advantage);
      } else {
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }

  async deleteAdvantage(req, res) {
    const role = req.user.role;
    const id = req.query.id;

    try {
      const advantage = await advantageModel.getOneAdvantageById(id);
      if (!advantage) {
        return res.json(ApiError.NotFound(`id: ${id} was not found`));
      }
      if (role === "admin") {
        const response = await advantageModel.deleteAdvantage(id);
        return res.status(200).json(response);
      } else {
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }
}

module.exports = new AdvantagesController();
