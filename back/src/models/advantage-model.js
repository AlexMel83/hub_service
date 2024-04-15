const knex = require("../../config/knex.config");
const ApiError = require("./../exceptions/api-errors");

const ADVANTAGES_TABLE = "advantages",
  CA_TABLE = "coworkings_advantages";
const advFields = ["id", "name", "description", "icon"];

module.exports = {
  async getAdvantages() {
    try {
      const response = await knex(ADVANTAGES_TABLE).select(advFields);

      if (!response.length) {
        throw ApiError.NotFound("data not found");
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getOneAdvantageById(id) {
    try {
      const response = await knex(ADVANTAGES_TABLE)
        .where("id", "=", id)
        .select(advFields);

      if (!response.length) {
        throw ApiError.NotFound("data not found");
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getAdvantagesByCoworkingId(id) {
    try {
      const response = await knex(`${ADVANTAGES_TABLE} AS a`)
        .select("a.id as advantage_id", "name", "description", "icon")
        .innerJoin(`${CA_TABLE} AS ca`, "ca.advantage_id", "a.id")
        .where("ca.coworking_id", id);

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async addAdvantage(fields) {
    try {
      return await knex(ADVANTAGES_TABLE).insert(fields).returning(advFields);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateAdvantage(fields) {
    try {
      return await knex(ADVANTAGES_TABLE)
        .where({ id: fields.id })
        .update(fields)
        .returning(advFields);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteAdvantage(id) {
    try {
      await knex(ADVANTAGES_TABLE).where({ id }).del();
      return { id: id };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async bindAdvantagesToCoworking(arrayAdvantages, coworking_id, trx = knex) {
    try {
      await trx(CA_TABLE).where({ coworking_id }).del();

      const coworkingAdvantages = arrayAdvantages.map((advantage_id) => ({
        coworking_id: coworking_id,
        advantage_id: advantage_id,
      }));

      if (coworkingAdvantages.length) {
        let result = await trx(CA_TABLE)
          .insert(coworkingAdvantages)
          .returning("advantage_id");
        return result;
      } else return [];
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};
