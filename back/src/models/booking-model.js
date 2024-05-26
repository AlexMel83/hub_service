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
const addSCFields = [
  "c.id as coworcing_id",
  "c.coworking_name as coworking_name",
  "c.address as coworking_address",
  "c.phone as coworking_phone",
  "c.email as coworking_email",
  "s.space_name as space_name",
  "s.amount as space_amount",
  "s.available_amount as space_available_amount",
];
const addUserFields = [
  "u.name as user_name",
  "u.surname as user_surname",
  "u.email as user_email",
  "u.phone as user_phone",
];
const addGuestFields = [
  "g.first_name as guest_first_name",
  "g.last_name as guest_last_name",
  "g.email as guest_email",
  "g.phone as guest_phone",
];

const conditionHandlers = {
  id: (bookingsQuery, value) => bookingsQuery.where("bookings.id", value),
  user_id: (bookingsQuery, value) =>
    bookingsQuery.where("bookings.user_id", value),
  space_name: (bookingsQuery, value) =>
    bookingsQuery.where("s.space_name", "ilike", `%${value}%`),
  user_name: (bookingsQuery, value) =>
    bookingsQuery.where("u.name", "like", `%${value}%`),
  user_phone: (bookingsQuery, value) =>
    bookingsQuery.where("u.phone", "like", `%${value}%`),
  start_time: (bookingsQuery, value) =>
    bookingsQuery.where("bookings.start_time", value),
  end_time: (bookingsQuery, value) =>
    bookingsQuery.where("bookings.end_time", value),
  status: (bookingsQuery, value) =>
    bookingsQuery.where("bookings.status", value),
  total_price: (bookingsQuery, value, sort) => {
    if (sort === "down") {
      bookingsQuery.where("bookings.total_price", "<=", value);
    } else if (sort === "up") {
      bookingsQuery.where("bookings.total_price", ">=", value);
    } else {
      bookingsQuery.where("bookings.total_price", value);
    }
  },
  sort_field: (bookingsQuery, value, sort) => {
    if (sort === "down") {
      bookingsQuery.orderBy(value, "desc");
    } else {
      bookingsQuery.orderBy(value, "asc");
    }
  },
};

module.exports = {
  async createBooking(bookingData, trx = knex) {
    const bookingDto = new BookingDto(bookingData);
    try {
      // create booking
      const [createdBooking] = await trx(BookingsTable)
        .insert(bookingDto)
        .returning(bookingFields);

      // Build the base query
      let query = trx(BookingsTable)
        .select([...bookingFields, "c.coworking_name", "s.space_name"])
        .join("spaces as s", "s.id", "bookings.space_id")
        .join("coworkings as c", "c.id", "s.coworking_id");
      // Add conditional left join if user login
      if (bookingDto.user_id) {
        query = query
          .leftJoin("users as u", "u.id", `${BookingsTable}.user_id`)
          .select(addUserFields);
      }
      // Execute the query and get the details
      const [bookingWithDetails] = await query
        .where("bookings.id", createdBooking.id)
        .returning("*");

      await trx.commit(createdBooking);
      return bookingWithDetails || createdBooking; // Return created booking if details are not found
    } catch (error) {
      console.error(error);
      await trx.rollback();
      throw error;
    }
  },

  async getBookingsByCondition(condition = {}, trx = knex) {
    let sort;
    if ("sortDirection" in condition) {
      sort = condition.sortDirection;
      delete condition.sortDirection;
    }
    try {
      const bookingsQuery = trx(BookingsTable)
        .select([
          ...bookingFields,
          ...addUserFields,
          ...addGuestFields,
          ...addSCFields,
        ])
        .leftJoin("users as u", "bookings.user_id", "u.id")
        .leftJoin("guests as g", "bookings.guest_id", "g.id")
        .join("spaces as s", "s.id", "bookings.space_id")
        .join("coworkings as c", "c.id", "s.coworking_id");

      if (condition["user_id"]) {
        bookingsQuery.where("bookings.user_id", condition["user_id"]);
        delete condition["user_id"];
      }
      if (condition["manager_id"]) {
        bookingsQuery.where("c.user_id", condition["manager_id"]);
        delete condition["manager_id"];
      }

      for (const [key, value] of Object.entries(condition)) {
        const handler = conditionHandlers[key];
        if (handler) {
          handler(bookingsQuery, value, sort);
        } else {
          bookingsQuery.where(key, value);
        }
      }

      return await bookingsQuery;
    } catch (error) {
      console.error("Error fetching payment by condition:", error.message);
      throw error;
    }
  },

  async getBookingsByDateRange(startDate, endDate) {
    try {
      return await knex("bookings")
        .where("start_time", ">", startDate)
        .andWhere("end_time", "<", endDate)
        .select("*");
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
