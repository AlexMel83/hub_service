const reviewsController = require("../controllers/reviews-controller");
const authMiddleware = require("../../middlewares/auth-middleware");
const { query, body } = require("express-validator");
const validateMiddleware = require("../../middlewares/validate-middleware");

const queryValidateReview = [
  query("id")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("id is number"),
  query("coworkingId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("coworkingId is number"),
  query("userId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("userId is number"),
  query("rating")
    .optional({ checkFalsy: true })
    .isInt({ min: 0, max: 5 })
    .withMessage("rating must be a number 0-5"),
];

const bodyValidateReview = [
  body("rating")
    .notEmpty()
    .withMessage('Поле "rating" обов\'язкове для заповнення')
    .isInt({ min: 0, max: 5 })
    .withMessage("rating must be a number 0-5"),
  body("coworkingId")
    .notEmpty()
    .isNumeric()
    .withMessage("coworkingId is number"),
  body("content")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("content must be a string"),
];

module.exports = function (app) {
  app.post(
    "/reviews",
    authMiddleware,
    bodyValidateReview,
    validateMiddleware,
    reviewsController.createReview,
  );

  app.get(
    "/reviews",
    queryValidateReview,
    validateMiddleware,
    reviewsController.getReview,
  );

  app.get(
    "/reviews/rating",
    query("coworkingId")
      .notEmpty()
      .withMessage("coworkingId is required")
      .isNumeric()
      .withMessage("coworkingId must be a number"),
    validateMiddleware,
    reviewsController.getRating,
  );

  app.delete(
    "/reviews",
    authMiddleware,
    query("id")
      .notEmpty()
      .withMessage("id is required")
      .isNumeric()
      .withMessage("id must be a number"),
    validateMiddleware,
    reviewsController.deleteReview,
  );
};
