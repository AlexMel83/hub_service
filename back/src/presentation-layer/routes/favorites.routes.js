const favoritesController = require("../controllers/favorites-controller");
const authMiddleware = require("../../middlewares/auth-middleware");
const { body, query, validationResult } = require("express-validator");
const ApiError = require("../../exceptions/api-errors");

module.exports = function (app) {
  app.post(
    "/favorites",
    authMiddleware,
    query("spaceId")
      .notEmpty()
      .withMessage("spaceId is required")
      .isNumeric()
      .withMessage("spaceId must be a number"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    favoritesController.createFavoriteSpace,
  );

  app.get(
    "/favorites",
    authMiddleware,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiError.BadRequest("Помилка при валідації", errors.array()));
      } else next();
    },
    favoritesController.getFavoritesSpacesByUserId,
  );

  app.put(
    "/favorites",
    authMiddleware,
    body("spaceIds")
      .notEmpty()
      .withMessage('Поле "spaceIds" обов\'язкове для заповнення')
      .isArray()
      .withMessage('Поле "spaceIds" повинно бути масивом'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    favoritesController.updateFavoritesByUserId,
  );

  app.delete(
    "/favorites",
    authMiddleware,
    query("spaceId")
      .notEmpty()
      .withMessage("spaceId is required")
      .isNumeric()
      .withMessage("spaceId must be a number"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    favoritesController.deleteFavoriteBySpaceId,
  );
};
