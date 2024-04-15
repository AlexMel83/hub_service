const knex = require("./../../config/knex.config");
const BookingDto = require("./../dtos/booking-dto");

const BookingsTable = "bookings";
const bookingFields = [
  "bookings.id",
  "bookings.user_id",
  "bookings.guest_id",
  "bookings.space_id",
  "bookings.start_time",
  "bookings.end_time",
  "bookings.timeslot_id",
  "bookings.seats",
  "bookings.total_price",
  "bookings.is_paid",
  "bookings.status",
  "bookings.created_at",
  "bookings.updated_at",
];

module.exports = {
  async createBooking(bookingData, trx = knex) {
    const bookingDto = new BookingDto(bookingData);
    return await trx(BookingsTable).insert(bookingDto).returning(bookingFields);
  },

  async getAllBookings() {
    return await knex(BookingsTable).select(bookingFields);
  },

  async getBookingById(id) {
    return await knex(BookingsTable).select(bookingFields).where({ id });
  },

  async getBookingsByUserId(user_id) {
    try {
      return await knex(BookingsTable)
        .select([
          ...bookingFields,
          "u.name as user_name",
          "u.surname as user_surname",
          "u.email as user_email",
          "u.phone as user_phone",
        ])
        .leftJoin("users as u", "bookings.user_id", "u.id")
        .where("bookings.user_id", user_id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getBookingsByGuestId(guest_id) {
    try {
      return await knex(BookingsTable)
        .select([
          ...bookingFields,
          "g.first_name as guest_first_name",
          "g.last_name as guest_last_name",
          "g.email as guest_email",
          "g.phone as guest_phone",
        ])
        .leftJoin("guests as g", "bookings.guest_id", "g.id")
        .where("bookings.guest_id", guest_id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getBookingsBySpaceId(space_id) {
    return await knex(BookingsTable).select(bookingFields).where({ space_id });
  },

  async getBookingsByCoworkingId(coworking_id) {
    try {
      return await knex(BookingsTable)
        .join("spaces as s", "bookings.space_id", "s.id")
        .join("coworkings as c", "s.coworking_id", "c.id")
        .where("c.id", coworking_id)
        .select([
          ...bookingFields,
          "c.coworking_name as coworking_name",
          "c.address as coworking_address",
          "c.phone as coworking_phone",
          "c.email as coworking_email",
          "s.space_name as space_name",
        ]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getBookingsByDateRange(startDate, endDate) {
    try {
      return await knex(BookingsTable)
        .where("start_time", ">=", startDate)
        .andWhere("end_time", "<=", endDate)
        .select(bookingFields);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async updateBooking(bookingData, trx = knex) {
    const bookingDto = new BookingDto(bookingData);
    return await trx(BookingsTable)
      .where({ id: bookingDto.id })
      .update(bookingDto)
      .returning(bookingFields);
  },

  async deleteBooking(id, trx = knex) {
    try {
      return await trx(BookingsTable)
        .where({ id })
        .del()
        .returning(bookingFields);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
