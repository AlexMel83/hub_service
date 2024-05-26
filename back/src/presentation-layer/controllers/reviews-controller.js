const ApiError = require("../../exceptions/api-errors");
const reviewModel = require("../../models/review-model");

const queryMappings = {
  id: "id",
  userId: "user_id",
  rating: "rating",
  coworkingId: "coworking_id",
};

module.exports = {
  async createReview(req, res) {
    const userId = req.user.id;
    const { coworkingId, rating, content } = req.body;
    try {
      const [response] = await reviewModel.createOrUpdateReview({
        userId,
        coworkingId,
        rating,
        content,
      });
      let words = "update in";
      const createdAt = new Date(response.created_at);
      const updatedAt = new Date(response.updated_at);
      if (createdAt.getTime() === updatedAt.getTime()) words = "add to";
      return res.status(200).json({
        message: `Review CoworkingId: ${coworkingId} ${words} review-list of userId: ${userId}`,
        ...response,
      });
    } catch (error) {
      console.error(error);
      return res.json(ApiError.IntServError(error.detail));
    }
  },

  async getReview(req, res) {
    const queryParams = req.query;
    let condition = {};
    let response;
    for (const key in queryParams) {
      const mappedKey = queryMappings[key];
      if (mappedKey) {
        condition[mappedKey] = queryParams[key];
      }
    }
    response = await reviewModel.getReviewsByCondition(condition);
    if (!response || (queryParams.id && response.length === 0)) {
      return res.json(ApiError.NotFound("review(s) not found"));
    }
    return res.json(response);
  },

  async getRating(req, res) {
    const coworking_id = req.query.coworkingId;
    const rating = reviewModel.getRating(coworking_id);
    if (!rating) return res.json(ApiError.NotFound("coworking not found"));
    else return res.json(rating);
  },

  async deleteReview(req, res) {
    let condition = {};
    condition.id = req.query.id;
    if (req.user.role !== "admin") condition.user_id = req.user.id;
    const response = await reviewModel.removeReview(condition);
    if (!response) res.json(ApiError.BadRequest("remove target(s) failed"));
    return res.json(response);
  },
};
