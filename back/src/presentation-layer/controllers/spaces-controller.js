const knex = require("./../../../config/knex.config");
const spaceModel = require("../../models/space-model");
const coworkingModel = require("../../models/coworking-model");
const ApiError = require("../../exceptions/api-errors");

class SpacesController {
  async getSpaces(req, res) {
    try {
      let response;
      if (req?.query?.name) {
        const name = req.query.name;
        response = await spaceModel.getSpacesByName(name);
      } else if (req?.query?.id) {
        const id = req.query.id;
        response = await spaceModel.getOneSpaceById(id);
      } else if (req?.query.coworking_id) {
        const coworking_id = req.query.coworking_id;
        response = await spaceModel.getSpacesByCoworkingId(coworking_id);
      } else {
        response = await spaceModel.getSpaces();
      }
      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  }

  async addSpace(req, res) {
    const user = req.user;

    const fields = req.body;
    fields.space_photo = req.file ? req.file.path : "";

    try {
      const coworking = await coworkingModel.getOneCoworkingById(
        fields.coworking_id,
      );

      if (!coworking) {
        return res.send(
          ApiError.NotFound(
            `coworking_id: ${fields.coworking_id} was not found`,
          ),
        );
      }

      if (
        user.role === "admin" ||
        (user.role === "manager" && user.id === coworking.user_id)
      ) {
        const space = await spaceModel.addSpace(fields);
        return res.status(200).send(space);
      } else {
        return res.send(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      if (error.code === "22P02") {
        return res.json(ApiError.BadRequest(`Not allowed send empty fields`));
      } else {
        console.error(error);
        return res.json(ApiError.IntServError(error.detail));
      }
    }
  }

  async updateSpace(req, res) {
    const user = req.user;

    const fields = req.body;
    if (req.file) {
      fields.space_photo = req.file.path;
    }

    const trx = await knex.transaction();
    try {
      const [space] = await spaceModel.getOneSpaceById(fields.id, trx);
      if (!space) {
        return res.status(404).json(ApiError.NotFoundError(fields.id));
      }
      if (space.space_photo !== undefined && fields.space_photo === undefined) {
        fields.space_photo = coworking.space_photo;
      }

      const coworking = await coworkingModel.getOneCoworkingById(
        space.coworking_id,
        trx,
      );

      if (
        user.role === "admin" ||
        (user.role === "manager" && user.id === coworking.user_id)
      ) {
        const updatedSpace = await spaceModel.updateSpace(fields, trx);
        await trx.commit();
        return res.status(200).json(updatedSpace);
      } else {
        await trx.rollback();
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      await trx.rollback();
      if (error.code === "22P02") {
        return res.json(ApiError.BadRequest(`Not allowed send empty fields`));
      } else {
        console.error(error);
        return res.json(ApiError.IntServError(error.detail));
      }
    }
  }

  async removeSpace(req, res) {
    const user = req.user;
    const id = req.query.id;
    try {
      const space = await spaceModel.getOneSpaceById(id);
      if (!space) {
        return res.json(ApiError.NotFound(`id: ${id} was not found`));
      }

      const coworking = await coworkingModel.getOneCoworkingById(
        space[0].coworking_id,
      );
      if (
        user.role === "admin" ||
        (user.role === "manager" && user.id === coworking.user_id)
      ) {
        const response = await spaceModel.removeSpace(id);
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

module.exports = new SpacesController();
