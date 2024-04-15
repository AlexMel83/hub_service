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
    const candidate = await knex(UsersTable)
      .select(userFields)
      .where("email", "=", email)
      .first();
    return candidate ? candidate : null;
  },

  async findUserByEmailWithHash(email) {
    const userFieldsWithHash = userFields;
    userFieldsWithHash.splice(2, 0, "password");
    const candidate = await knex(UsersTable)
      .select(userFields)
      .where("email", "=", email)
      .first();
    return candidate ? candidate : null;
  },

  async findUserById(userId) {
    const candidate = await knex(UsersTable)
      .select(userFields)
      .where("id", "=", userId)
      .first();
    return candidate ? candidate : null;
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
    const result = await knex(UsersTable)
      .where({ id: payload.id })
      .update(payload)
      .returning(userFields);
    return result[0];
  },

  async deleteUser(userId) {
    await knex(UsersTable).where({ id: userId }).del();
    return { id: userId };
  },
};
