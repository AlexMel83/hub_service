const knex = require("./../../../config/knex.config");
const ApiError = require("../../exceptions/api-errors");
const bookingModel = require("../../models/booking-model");
const guestModel = require("../../models/guest-model");

module.exports = {
  async createBooking(req, res) {
    let guest = null;
    const trx = await knex.transaction();
    try {
      let { spaceId, startTime, endTime, timeslotId, seats, totalPrice } =
        req.body;
      timeslotId ? timeslotId : (timeslotId = null);
      let { userId } = req.body;
      if (req.user) {
        userId = req.user.id;
      } else {
        const { firstName, lastName, email, phone } = req.body;
        [guest] = await guestModel.createGuest(
          {
            firstName,
            lastName,
            email,
            phone,
          },
          trx,
        );
        userId = null;
      }
      const booking = await bookingModel.createBooking(
        {
          userId,
          guestId: guest?.id,
          spaceId,
          timeslotId,
          startTime,
          endTime,
          seats,
          totalPrice,
          status: "new",
        },
        trx,
      );
      if (guest) {
        booking.guest = guest;
      }
      await trx.commit();
      res.status(201).json(booking);
    } catch (error) {
      await trx.rollback();
      return res.json(ApiError.IntServError(error.detail));
    }
  },

  async getAllBookings(req, res) {
    try {
      const bookings = await bookingModel.getAllBookings();
      if (bookings.length) {
        return res.status(200).json(bookings);
      } else {
        return res.json(ApiError.NotFound("any bookings not found"));
      }
    } catch (error) {
      return res.json(
        ApiError.IntServError(
          "Помилка при отриманні списку бронювань",
          error.detail,
        ),
      );
    }
  },

  async getBookingById(req, res) {
    try {
      const booking = await bookingModel.getBookingById(req.query.id);
      if (booking.length) {
        return res.status(200).json(booking);
      } else {
        return res.json(
          ApiError.NotFound(`booking with id: ${req.query.id} not found`),
        );
      }
    } catch (error) {
      return res.json(
        ApiError.IntServError(
          "Помилка при отриманні списку бронювань",
          error.detail,
        ),
      );
    }
  },

  async getBookingsByUserId(req, res) {
    const role = req.user.role;
    try {
      const bookings = await bookingModel.getBookingsByUserId(req.query.userId);
      if (bookings.length) {
        if (role === "admin" || req.user.id === bookings[0].user_id) {
          return res.status(200).json(bookings);
        } else {
          return res.json(ApiError.AccessDeniedForRole("User not owner"));
        }
      } else {
        return res.json(
          ApiError.NotFound(
            `booking with userId: ${req.query.userId} not found`,
          ),
        );
      }
    } catch (error) {
      return res.json(
        ApiError.IntServError(
          "Помилка при отриманні списку бронювань",
          error.detail,
        ),
      );
    }
  },

  async getBookingsByGuestId(req, res) {
    try {
      const bookings = await bookingModel.getBookingsByGuestId(
        req.query.guestId,
      );
      if (bookings.length) {
        return res.status(200).json(bookings);
      } else {
        return res.json(
          ApiError.NotFound(
            `booking with guestId: ${req.query.guestId} not found`,
          ),
        );
      }
    } catch (error) {
      return res.json(
        ApiError.IntServError(
          "Помилка при отриманні списку бронювань",
          error.detail,
        ),
      );
    }
  },

  async getBookingsBySpaceId(req, res) {
    try {
      const bookings = await bookingModel.getBookingsBySpaceId(
        req.query.spaceId,
      );
      if (bookings.length) {
        return res.status(200).json(bookings);
      } else {
        return res.json(
          ApiError.NotFound(
            `booking with spaceId: ${req.query.spaceId} not found`,
          ),
        );
      }
    } catch (error) {
      return res.json(
        ApiError.IntServError(
          "Помилка при отриманні списку бронювань",
          error.detail,
        ),
      );
    }
  },

  async getBookingsByCoworkingId(req, res) {
    try {
      const bookings = await bookingModel.getBookingsByCoworkingId(
        req.query.coworkingId,
      );
      if (bookings.length) {
        return res.status(200).json(bookings);
      } else {
        return res.json(
          ApiError.NotFound(
            `booking with coworkingId: ${req.query.coworkingId} not found`,
          ),
        );
      }
    } catch (error) {
      return res.json(
        ApiError.IntServError(
          "Помилка при отриманні списку бронювань",
          error.detail,
        ),
      );
    }
  },

  async getBookingsByDateRange(req, res) {
    const { startDate, endDate } = req.query;
    try {
      const bookings = await bookingModel.getBookingsByDateRange(
        startDate,
        endDate,
      );
      if (bookings.length) {
        return res.status(200).json(bookings);
      } else {
        return res.json(
          ApiError.NotFound(
            `booking with dataRange >= ${req.query.startDate} and <= ${req.query.endDate} not found`,
          ),
        );
      }
    } catch (error) {
      return res.json(
        ApiError.IntServError("An internal server error occurred", error),
      );
    }
  },

  async updateBooking(req, res) {
    const user_id = req.user.id;
    const role = req.user.role;
    const trx = await knex.transaction();
    try {
      const [bookingQuery] = await bookingModel.getBookingById(
        req.body.id,
        trx,
      );
      const {
        id,
        userId,
        guestId,
        spaceId,
        startTime,
        endTime,
        timeslotId,
        seats,
        totalPrice,
        status,
        isPaid,
      } = req.body;
      if (!bookingQuery) {
        await trx.rollback();
        return res.json(ApiError.NotFound(`id: ${id} was not found`));
      }
      const now = Date.now();
      const updatedAt = new Date(now).toISOString();
      if (role === "admin" || user_id === bookingQuery.user_id) {
        const updatedBooking = await bookingModel.updateBooking(
          {
            id,
            userId,
            guestId,
            spaceId,
            startTime,
            endTime,
            timeslotId,
            seats,
            totalPrice,
            status,
            isPaid,
            updatedAt,
          },
          trx,
        );
        if (!updatedBooking.length) {
          await trx.rollback();
          return res.json(ApiError.NotFound(`id: ${id} was not found`));
        }
        await trx.commit();
        return res.status(200).json(updatedBooking);
      } else {
        await trx.rollback();
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      console.error(error);
      await trx.rollback();
      return res.json(
        ApiError.IntServError("Помилка при оновленні бронювання", error.detail),
      );
    }
  },

  async deleteBooking(req, res) {
    const user_id = req.user.id;
    const role = req.user.role;
    const id = req.query.id;
    const trx = await knex.transaction();
    try {
      const [bookingQuery] = await bookingModel.getBookingById(
        req.query.id,
        trx,
      );
      if (!bookingQuery) {
        await trx.rollback();
        return res.json(ApiError.NotFound(`id: ${id} was not found`));
      } else if (bookingQuery.is_paid) {
        await trx.rollback();
        return res.json(ApiError.BadRequest("booking was paid"));
      }
      if (role === "admin" || user_id === bookingQuery.user_id) {
        const [response] = await bookingModel.deleteBooking(id, trx);
        if (!response) {
          await trx.rollback();
          return res.json(ApiError.NotFoundError(`id: ${id} was not found`));
        }
        await trx.commit();
        return res
          .status(200)
          .json({ message: "Бронювання успішно видалено", ...response });
      } else {
        await trx.rollback();
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }
    } catch (error) {
      await trx.rollback();
      return res.json(
        ApiError.IntServError("Помилка при видалені бронювання", error.detail),
      );
    }
  },
};
