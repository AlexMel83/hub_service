const knex = require("./../../config/knex.config");

const UsersTable = "users";
const userFields = [
  "id",
  "email",
  "name",
  "surname",
  "phone",
  "role",
  "activationlink",
  "isactivated",
  "created_at",
  "updated_at",
];

module.exports = {
  async insertUser(userData, trx) {
    return await trx(UsersTable).insert(userData).returning(userFields);
  },

  async activateUser(userData, trx) {
    return await trx(UsersTable)
      .where({ email: userData.email })
      .update({ isactivated: userData.isactivated })
      .returning(userFields);
  },

  async findUserByEmail(email) {
    try {
      const candidate = await knex(UsersTable)
        .select(userFields)
        .where("email", "=", email)
        .first();
      return candidate ? candidate : null;
    } catch (e) {
      next(e);
    }
  },

  async findUserByEmailWithHash(email) {
    const userFieldsWithHash = userFields;
    userFieldsWithHash.splice(2, 0, "password");
    try {
      const candidate = await knex(UsersTable)
        .select(userFields)
        .where("email", "=", email)
        .first();
      return candidate ? candidate : null;
    } catch (e) {
      next(e);
    }
  },

  async findUserById(userId) {
    try {
      const candidate = await knex(UsersTable)
        .select(userFields)
        .where("id", "=", userId)
        .first();
      return candidate ? candidate : null;
    } catch (e) {
      next(e);
    }
  },

  async findUserByActivationLink(activationLink, trx) {
    return await trx(UsersTable)
      .select(userFields)
      .where("activationlink", "=", activationLink)
      .first();
  },

  async find() {
    return await knex(UsersTable).select(userFields);
  },

  async editUser(payload) {
    try {
      const result = await knex(UsersTable)
        .where({ id: payload.id })
        .update(payload)
        .returning(userFields);
      return result[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      await knex(UsersTable).where({ id: userId }).del();
      return { id: userId };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
