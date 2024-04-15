module.exports = class BookingDto {
  id;
  user_id;
  guest_id;
  space_id;
  start_time;
  end_time;
  timeslot_id;
  seats;
  total_price;
  is_paid;
  status;
  created_at;
  updated_at;

  constructor(model) {
    this.id = model.id;
    this.user_id = model.userId;
    this.guest_id = model.guestId;
    this.space_id = model.spaceId;
    this.start_time = model.startTime;
    this.end_time = model.endTime;
    this.timeslot_id = model.timeslotId;
    this.seats = model.seats;
    this.total_price = model.totalPrice;
    this.is_paid = model.isPaid;
    this.status = model.status;
    this.created_at = model.createdAt;
    this.updated_at = model.updatedAt;
  }
};
