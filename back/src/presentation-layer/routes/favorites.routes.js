const favoritesController = require("../controllers/favorites-controller");
const authMiddleware = require("../../middlewares/auth-middleware");
const { body, query } = require("express-validator");
const validateMiddleware = require("../../middlewares/validate-middleware");

module.exports = function (app) {
  app.post(
    "/favorites",
    authMiddleware,
    query("spaceId")
      .notEmpty()
      .withMessage("spaceId is required")
      .isNumeric()
      .withMessage("spaceId must be a number"),
    validateMiddleware,
    favoritesController.createFavoriteSpace,
  );

  app.get(
    "/favorites",
    authMiddleware,
    query("user_id")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("user_id is number"),
    validateMiddleware,
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
    validateMiddleware,
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
    validateMiddleware,
    favoritesController.deleteFavoriteBySpaceId,
  );
};
