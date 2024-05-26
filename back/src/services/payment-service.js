const crypto = require("crypto");
const uuid = require("uuid");
const moment = require("moment-timezone");
const paymentModel = require("../models/payment-model");
const bookingModel = require("../models/booking-model");
const ApiError = require("../exceptions/api-errors");
const { LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY, LIQPAY_CHECKOUT_URL, API_URL } =
  process.env;

function createLiqPaySignature(data) {
  const privateKey = LIQPAY_PRIVATE_KEY;
  const signatureString = `${privateKey}${data}${privateKey}`;
  const sha1 = crypto.createHash("sha1").update(signatureString).digest();
  const signature = Buffer.from(sha1).toString("base64");

  return signature;
}
class PaymentService {
  async payForBooking(booking) {
    const amount = booking.total_price;
    const currency = "UAH";
    const description = `Платіж за бронювання простору "${booking.space_name}" в коворкінгу "${booking.coworking_name}" з ${moment(booking.start_time).tz("Europe/Kiev").format("DD.MM.YYYY HH:mm")} до ${moment(booking.end_time).tz("Europe/Kiev").format("DD.MM.YYYY HH:mm")} за київським часом`;
    const orderID =
      booking.id.toString() + crypto.randomInt(100, 1000).toString().slice(-3);
    const activationLink = uuid.v4();
    let responseUrl = `${API_URL}/payments/${activationLink}`;

    const paymentData = {
      public_key: LIQPAY_PUBLIC_KEY,
      version: 3,
      action: "pay",
      amount,
      currency,
      description,
      order_id: orderID,
      result_url: responseUrl,
      server_url: `${API_URL}/payments`,
    };

    const data = Buffer.from(JSON.stringify(paymentData)).toString("base64");
    const signature = createLiqPaySignature(data);

    try {
      const checkoutURL = `${LIQPAY_CHECKOUT_URL}?data=${data}&signature=${signature}`;
      await paymentModel.createPayment({
        bookingId: booking.id,
        paymentMethod: "online payment",
        amount,
        currency,
        description,
        orderId: orderID,
        activationLink,
      });

      return checkoutURL;
    } catch (error) {
      console.error("Payment request failed:", error);
      throw error;
    }
  }

  async activate(activationLink, orderId, status, trx) {
    const bookingId = orderId?.slice(0, -3);
    try {
      if (status === "failure") {
        const [booking] = await bookingModel.updateBooking(
          {
            id: bookingId,
            isPaid: true,
            updatedAt: new Date().toISOString(),
          },
          trx,
        );
        return booking;
      }
      const [payment] = await paymentModel.getPaymentByCondition(
        { activation_link: activationLink },
        trx,
      );
      if (!payment) {
        throw ApiError.BadRequest("Wrong activation link");
      }
      if (payment.booking_paid) {
        throw ApiError.BadRequest("Booking already paid");
      }
      await bookingModel.updateBooking(
        {
          id: payment.booking_id,
          isPaid: true,
          updated_at: new Date().toISOString(),
        },
        trx,
      );
      return payment;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
