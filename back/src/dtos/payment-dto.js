module.exports = class PaymentDto {
  id;
  booking_id;
  payment_method;
  amount;
  currency;
  description;
  activation_link;
  lifetime;
  payment_reference;
  created_at;
  updated_at;

  constructor(model) {
    this.id = model.id;
    this.booking_id = model.bookingId;
    this.payment_method = model.paymentMethod;
    this.amount = model.amount;
    this.currency = model.currency;
    this.description = model.description;
    this.activation_link = model.activationLink;
    this.lifetime = model.lifetime || null;
    this.payment_reference = model.paymentReference || null;
    this.created_at = model.createdAt;
    this.updated_at = model.updatedAt;
  }
};
