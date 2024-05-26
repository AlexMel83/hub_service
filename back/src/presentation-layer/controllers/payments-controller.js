const ApiError = require("../../exceptions/api-errors");
const { CLIENT_URL } = process.env;
const knex = require("./../../../config/knex.config");
const paymentService = require("./../../services/payment-service");
const paymentModel = require("../../models/payment-model");

async function isUserOwnerPayment(user, id = null, userId = null) {
  if (user?.role === "admin") return true;
  if (id || userId) {
    const [payment] = await (id
      ? paymentModel.getPaymentByCondition({ id: id })
      : paymentModel.getPaymentByCondition({ user_id: userId }));
    if (!payment) {
      return id ? { idNotFound: true } : { userIdNotFound: true };
    }
    return user.id === payment.user_id;
  }
  return false;
}

module.exports = {
  async activate(req, res) {
    const paymentDataEncoded = req.body.data;
    const paymentDataJson = Buffer.from(paymentDataEncoded, "base64").toString(
      "utf-8",
    );
    const paymentData = JSON.parse(paymentDataJson);

    const trx = await knex.transaction();
    try {
      const activationLink = req.params.link;
      if (paymentData.status === "success") {
        const payment = await paymentService.activate(
          activationLink,
          paymentData.order_id,
          paymentData.status,
          trx,
        );
        await trx.commit();
        return res.redirect(
          `${CLIENT_URL}/success?payment_id=${payment.payment_id}`,
        );
      } else if (paymentData.status === "failure") {
        const booking = await paymentService.activate(
          activationLink,
          paymentData.order_id,
          paymentData.status,
          trx,
        );
        await trx.rollback();
        return res.redirect(`${CLIENT_URL}/failure?booking_id=${booking.id}`);
      }
    } catch (error) {
      await trx.rollback();
      console.error(error);
      if (error.status === 400) {
        return res.json(ApiError.BadRequest(error));
      } else {
        return res.json(ApiError.IntServError(error));
      }
    }
  },

  async getPayments(req, res) {
    const user = req.user;
    const query = req.query;
    let condition = {};
    let response;

    try {
      if (!user && query?.id) {
        const [payment] = await paymentModel.getPaymentByCondition({
          id: query?.id,
        });
        if (!payment.guest_first_name) {
          return res.json(ApiError.AccessDeniedForRole("User not owner"));
        } else {
          return res.status(200).json(payment);
        }
      }
      if (!(await isUserOwnerPayment(user, null, user?.id))) {
        return res.json(ApiError.AccessDeniedForRole("User not owner"));
      }

      if (user.role === "user") {
        condition.user_id = user.id;
      } else if (query.userId) {
        condition.user_id = query.userId;
      }

      if (user.role === "manager") {
        condition.manager_id = user.id;
      } else if (query.userId) {
        condition.user_id = query.userId;
      }

      if (query.userId) {
        condition.user_id = query.userId;
      } else if (query.id) {
        condition.id = query.id;
      } else if (query.coworkingId) {
        condition.coworking_id = query.coworkingId;
      } else if (query.spaceId) {
        condition.space_id = query.spaceId;
      }

      response = await paymentModel.getPaymentByCondition(condition);

      if (!response || (query.id && response.length === 0)) {
        return res.json(ApiError.NotFound("Payment(s) not found"));
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.message));
    }
  },

  async updatePayment(req, res) {
    const { id, description, payment_reference } = req.body;
    const user = req.user;
    const result = await isUserOwnerPayment(user, id);
    if (result.idNotFound) {
      return res.json(ApiError.NotFound(`id: ${id} was not found`));
    } else if (result) {
      const [response] = await paymentModel.updatePayment(
        { description, payment_reference },
        id,
      );
      return res.status(200).json(response);
    } else {
      return res.json(ApiError.AccessDeniedForRole("User not owner"));
    }
  },

  async deletePayment(req, res) {
    const id = req.query.id;
    const user = req.user;
    const result = await isUserOwnerPayment(user, id);
    if (result.idNotFound) {
      return res.json(ApiError.NotFound(`id: ${id} was not found`));
    } else if (result) {
      const [response] = await paymentModel.deletePayment(id);
      return res.status(200).json(response);
    } else {
      return res.json(ApiError.AccessDeniedForRole("User not owner"));
    }
  },
};
