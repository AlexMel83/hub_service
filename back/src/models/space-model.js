const knex = require("../../config/knex.config");
const ApiError = require("./../exceptions/api-errors");

const SPACES_TABLE = "spaces",
  spaceFields = [
    "id",
    "space_name",
    "description",
    "space_photo",
    "amount",
    "available_amount",
    "first_price",
    "last_price",
    "coworking_id",
  ];

module.exports = {
  async getSpaces() {
    try {
      const response = await knex(SPACES_TABLE).select(spaceFields);

      if (!response.length) {
        throw ApiError.NotFoundError("data not found");
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getSpacesByName(name) {
    try {
      const spaces = await knex(SPACES_TABLE)
        .select(spaceFields)
        .whereRaw("LOWER(spaces.space_name) LIKE ?", [
          `%${name.toLowerCase()}%`,
        ]);

      if (!spaces.length) {
        throw ApiError.NotFoundError(name);
      }

      return spaces;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async getOneSpaceById(id, trx = knex) {
    try {
      const response = await trx(SPACES_TABLE)
        .where("id", "=", id)
        .select(spaceFields);

      if (!response.length) {
        throw ApiError.NotFoundError(id);
      }

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getSpacesByCoworkingId(id) {
    try {
      let response = await knex(SPACES_TABLE)
        .select(spaceFields)
        .where("spaces.coworking_id", "=", id);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async addSpace(fields) {
    try {
      return await knex(SPACES_TABLE).insert(fields).returning(spaceFields);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateSpace(fields, trx = knex) {
    try {
      return await trx(SPACES_TABLE)
        .where({ id: fields.id })
        .update(fields)
        .returning(spaceFields);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async removeSpace(id) {
    try {
      await knex(SPACES_TABLE).where({ id }).del();
      return { id: id };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
