require("dotenv").config({
  path: __dirname + `/../.${process.env.NODE_ENV}.env`,
});
const knex = require("./../../../config/knex.config");
const ApiError = require("../../exceptions/api-errors");
const bookingModel = require("../../models/booking-model");
const guestModel = require("../../models/guest-model");
const paymentService = require("../../services/payment-service");

const queryMappings = {
  userId: "user_id",
  id: "id",
  coworkingId: "coworking_id",
  spaceId: "space_id",
  guestId: "guest_id",
  spaceName: "space_name",
  userName: "user_name",
  userPhone: "user_phone",
  totalPrice: "total_price",
  status: "status",
  sortField: "sort_field",
  sortDirection: "sortDirection",
};

async function isUserOwnerBooking(user, id = null, userId = null) {
  if (user.role === "admin") return true;
  if (id || userId) {
    let condition = null;
    if (id) {
      condition = { id };
    } else {
      condition = { user_id: userId };
    }
    const [booking] = await bookingModel.getBookingsByCondition(condition);
    if (!booking) {
      return id ? { idNotFound: true } : { userIdNotFound: true };
    }
    return user.id === booking.user_id;
  }
  return false;
}

module.exports = {
  async createBooking(req, res) {
    let guest = null,
      response = null;
    const trx = await knex.transaction();
    try {
      let { spaceId, startTime, endTime, timeslotId, seats, totalPrice } =
        req.body;
      timeslotId ? timeslotId : (timeslotId = null);
      let { userId } = req.body;
      if (req.user) {
        userId = req.user.id; // if user authorized use his id
      } else {
        const { firstName, lastName, email, phone } = req.body; //else create new guest with contact-data
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
      //create booking
      response = await bookingModel.createBooking(
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
        // attach guest data if user not authorized
        response.guest = guest;
        response.user_email = guest.email;
      }

      await trx.commit();
      const responseData = await paymentService.payForBooking(response); //create payment and return responseData
      if (responseData) {
        // if success redirect user to payment's platform
        return res.json(responseData);
      } else {
        console.error(responseData.error_message);
        throw new Error(responseData.error_message);
      }
    } catch (error) {
      await trx.rollback();
      return res.json(ApiError.IntServError(error.detail));
    }
  },

  async getBookings(req, res) {
    const user = req.user;
    let condition = {};
    try {
      if (user && !(await isUserOwnerBooking(user, null, user.id))) {
        return res
          .status(403)
          .json(ApiError.AccessDeniedForRole("User not owner"));
      }
      const { startDate, endDate, ...otherQueryParams } = req.query;
      let response;
      if (user?.role === "manager") {
        condition.manager_id = user.id;
      }
      if (startDate && endDate) {
        response = await bookingModel.getBookingsByDateRange(
          startDate,
          endDate,
        );
      } else {
        for (const key in otherQueryParams) {
          const mappedKey = queryMappings[key];
          if (mappedKey) {
            condition[mappedKey] = otherQueryParams[key];
          }
        }
        response = await bookingModel.getBookingsByCondition(condition);
      }

      if (!response || (otherQueryParams.id && response.length === 0)) {
        return res.status(404).json(ApiError.NotFound("Booking(s) not found"));
      }

      return res.json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json(ApiError.IntServError(error.message));
    }
  },

  async updateBooking(req, res) {
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
    const user = req.user;
    const result = await isUserOwnerBooking(user, id);
    const now = Date.now();
    const updatedAt = new Date(now).toISOString();
    if (result.idNotFound) {
      return res.json(ApiError.NotFound(`id: ${id} was not found`));
    } else if (result) {
      try {
        const updatedBooking = await bookingModel.updateBooking({
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
        });
        return res.status(200).json(updatedBooking);
      } catch (error) {
        console.error(error);
        return res.json(
          ApiError.IntServError(
            "Помилка при оновленні бронювання",
            error.detail,
          ),
        );
      }
    } else {
      return res.json(ApiError.AccessDeniedForRole("User not owner"));
    }
  },

  async deleteBooking(req, res) {
    const id = req.query.id;
    const user = req.user;
    const result = await isUserOwnerBooking(user, id);
    if (result.idNotFound) {
      return res.json(ApiError.NotFound(`id: ${id} was not found`));
    } else if (result) {
      const [response] = await bookingModel.deleteBooking(id);
      return res.status(200).json(response);
    } else {
      return res.json(ApiError.AccessDeniedForRole("User not owner"));
    }
  },
};
