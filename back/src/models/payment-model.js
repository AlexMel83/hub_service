const knex = require("./../../config/knex.config");
const PaymentDto = require("./../dtos/payment-dto");

const PaymentsTable = "payments";
const paymentFields = [
  "payments.id as payment_id",
  "payments.booking_id",
  "payments.payment_method",
  "payments.amount",
  "payments.currency",
  "payments.description",
  "payments.activation_link",
  "payments.lifetime",
  "payments.payment_reference",
  "payments.created_at",
  "payments.updated_at",
];
const addSCFields = [
  "c.id as coworcing_id",
  "c.coworking_name as coworking_name",
  "c.address as coworking_address",
  "c.phone as coworking_phone",
  "c.user_id as manager_id",
  "c.email as coworking_email",
  "s.space_name as space_name",
  "s.amount as space_amount",
  "s.available_amount as space_available_amount",
];
const addUserFields = [
  "u.id as user_id",
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

module.exports = {
  async createPayment(paymentData, trx = knex) {
    const paymentDto = new PaymentDto(paymentData);
    return await trx(PaymentsTable).insert(paymentDto).returning(paymentFields);
  },

  async getPaymentByCondition(condition = {}, trx = knex) {
    try {
      const paymentsQuery = trx(PaymentsTable)
        .select([
          ...paymentFields,
          ...addSCFields,
          ...addUserFields,
          ...addGuestFields,
        ])
        .join("bookings as b", "payments.booking_id", "b.id")
        .leftJoin("users as u", "b.user_id", "u.id")
        .leftJoin("guests as g", "b.guest_id", "g.id")
        .join("spaces as s", "b.space_id", "s.id")
        .join("coworkings as c", "c.id", "s.coworking_id");
      if (condition.id) {
        paymentsQuery.where("payments.id", condition.id);
        delete condition.id;
      }
      if (condition["user_id"]) {
        paymentsQuery.where("b.user_id", condition["user_id"]);
        delete condition["user_id"];
      }
      if (condition["manager_id"]) {
        paymentsQuery.where("c.user_id", condition["manager_id"]);
        delete condition["manager_id"];
      }
      if (Object.keys(condition).length > 0) {
        paymentsQuery.where(condition);
      }
      const payments = await paymentsQuery;
      return payments;
    } catch (error) {
      console.error("Error fetching payment by condition:", error.message);
      throw error;
    }
  },

  async updatePayment(paymentData, id) {
    return await knex(PaymentsTable)
      .update(paymentData)
      .where({ id })
      .returning(paymentFields);
  },

  async deletePayment(id) {
    return await knex(PaymentsTable).where({ id }).del().returning("id");
  },
};
