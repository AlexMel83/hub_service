const knex = require("../../config/knex.config");

const favoriteSpacesTable = "favorite_spaces";
const favoriteSpacesFields = [
  "favorite_spaces.id",
  "favorite_spaces.user_id",
  "favorite_spaces.space_id",
  "favorite_spaces.created_at",
];

module.exports = {
  async createFavoriteSpace(user_id, space_id) {
    return await knex(favoriteSpacesTable)
      .insert({ user_id, space_id })
      .returning(favoriteSpacesFields);
  },

  async getFavoritesByUserId(user_id) {
    try {
      return await knex(favoriteSpacesTable)
        .join("spaces as s", "favorite_spaces.space_id", "s.id")
        .join("coworkings as c", "s.coworking_id", "c.id")
        .select([
          ...favoriteSpacesFields,
          "s.space_name as space_name",
          "c.coworking_name as coworking_name",
          "c.address as coworking_address",
        ])
        .where("favorite_spaces.user_id", user_id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateFavoriteSpaces(user_id, spaceIds) {
    let response = null;
    await knex.transaction(async (trx) => {
      await trx(favoriteSpacesTable).where({ user_id }).delete();
      const inserts = spaceIds.map((space_id) => ({
        user_id,
        space_id,
      }));
      response = await trx(favoriteSpacesTable)
        .insert(inserts)
        .returning(favoriteSpacesFields);
    });
    return response;
  },

  async deleteFavoriteBySpaceId(user_id, space_id) {
    try {
      return await knex(favoriteSpacesTable).where({ user_id, space_id }).del();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
