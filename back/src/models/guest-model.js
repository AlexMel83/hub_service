const knex = require("./../../config/knex.config");
const GuestDto = require("./../dtos/guest-dto");

const GuestsTable = "guests";
const guestFields = ["id", "first_name", "last_name", "email", "phone"];

module.exports = {
  async createGuest(guestData, trx = knex) {
    const guestDto = new GuestDto(guestData);
    return await trx(GuestsTable).insert(guestDto).returning(guestFields);
  },
};
