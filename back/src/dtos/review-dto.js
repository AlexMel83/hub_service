module.exports = class PaymentDto {
  id;
  coworking_id;
  rating;
  content;
  user_id;
  created_at;
  updated_at;

  constructor(model) {
    this.id = model.id;
    this.coworking_id = model.coworkingId;
    this.rating = model.rating;
    this.content = model.content;
    this.user_id = model.userId;
    this.created_at = model.createdAt;
    this.updated_at = model.updatedAt;
  }
};
