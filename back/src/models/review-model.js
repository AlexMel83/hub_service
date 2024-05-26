const knex = require("../../config/knex.config");
const ReviewDto = require("../dtos/review-dto");
const reviewsTable = "reviews as r",
  usersTable = "users as u",
  coworkingsTable = "coworkings as c";

const userFields = ["u.id as user_id", "u.name", "u.surname"];

const reviewFields = [
  "r.id",
  "r.coworking_id",
  "r.rating",
  "r.content",
  "r.user_id",
  "r.created_at",
  "r.updated_at",
];

const coworkingsFields = ["c.id as coworking_id", "c.coworking_name"];

const conditionHandlers = {
  id: (query, value) => query.where("id", value),
  coworking_id: (query, value) => query.where("coworking_id", value),
  user_id: (query, value) => query.where("user_id", value),
  rating: (query, value) => query.where("rating", value),
};

module.exports = {
  async createOrUpdateReview(payload) {
    const reviewDto = new ReviewDto(payload);
    const { coworking_id, rating, content, user_id } = reviewDto;
    try {
      const result = await knex(reviewsTable)
        .insert({
          coworking_id,
          user_id,
          rating,
          content,
          updated_at: knex.fn.now(),
          created_at: knex.fn.now(),
        })
        .onConflict(["coworking_id", "user_id"])
        .merge({ rating, content, updated_at: knex.fn.now() })
        .returning(reviewFields);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getReviewsByCondition(condition = {}) {
    try {
      const reviewsQuery = knex(reviewsTable)
        .join(coworkingsTable, "r.coworking_id", "c.id")
        .join(usersTable, "r.user_id", "u.id")
        .select([...reviewFields, ...coworkingsFields, ...userFields]);
      if (condition["user_id"]) {
        reviewsQuery.where("r.user_id", condition["user_id"]);
        delete condition["user_id"];
      } else if (condition["id"]) {
        reviewsQuery.where("r.id", condition["id"]);
        delete condition["id"];
      }
      for (const [key, value] of Object.entries(condition)) {
        const handler = conditionHandlers[key];
        if (handler) handler(reviewsQuery, value);
        else reviewsQuery.where(key, value);
      }
      return await reviewsQuery;
    } catch (error) {
      console.error("Error fetching reviews by condition:", error.message);
      throw error;
    }
  },

  async getRating(coworking_id) {
    try {
      const response = await knex(reviewsTable)
        .avg("rating as average_rating")
        .where({ coworking_id })
        .first();
      if (response) {
        const average = response.average_rating;
        return average;
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async removeReview(condition) {
    try {
      const result = await knex(reviewsTable).where(condition).delete();
      if (result) return { message: "Review deleted successfully" };
      else return { message: "Review not deleted" };
    } catch (error) {
      console.error("Error deleting review by condition:", error.message);
      throw error;
    }
  },
};
