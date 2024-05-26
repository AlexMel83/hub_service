const intersectionController = require("../controllers/intersection-controller");
const { body, query } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const validateMiddleware = require("../../middlewares/validate-middleware");

const validateBodyTarget = [
  body("coworkingId")
    .notEmpty()
    .withMessage('Поле "coworkingId" не має бути пустим')
    .isNumeric()
    .withMessage('Поле "coworkingId" має бути числом'),
  body("anotherCoworkingId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "anotherCoworkingId" має бути числом'),
  body("azimuthDegrees")
    .notEmpty()
    .withMessage('Поле "azimuthDegrees" не має бути пустим')
    .isFloat({ min: 0, max: 360 })
    .withMessage('Поле "azimuthDegrees" має бути числом'),
  body("distance")
    .notEmpty()
    .withMessage('Поле "distance" не має бути пустим')
    .isNumeric()
    .withMessage('Поле "distance" має бути числом'),
  body("type")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "type" має бути рядком'),
  body("frequency")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "frequency" має бути числом'),
  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "description" має бути рядком'),
];

const validateQuery = [
  query("id")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("id is number"),
  query("userId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("userId is number"),
  query("coworkingId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("coworkingId is number"),
  query("anotherCoworkingId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("anotherCoworkingId is number"),
  query("frequency")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "frequency" має бути числом'),
  query("type")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "typey" має бути  рядком'),
  query("startDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("startDate must be a valid ISO 8601 date"),
  query("endDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("endDate must be a valid ISO 8601 date"),
];

const validateBodyPoint = [
  body("firstCowId")
    .notEmpty()
    .withMessage('Поле "firstCowId" не має бути пустим')
    .isNumeric()
    .withMessage('Поле "firstCowId" має бути числом'),
  body("secondCowId")
    .notEmpty()
    .withMessage('Поле "secondCowId" не має бути пустим')
    .isNumeric()
    .withMessage('Поле "secondCowId" має бути числом'),
  body("firstAngle")
    .notEmpty()
    .withMessage('Поле "firstAngle" не має бути пустим')
    .isFloat({ min: 0, max: 360 })
    .withMessage('Поле "firstAngle" має бути числом'),
  body("secondAngle")
    .notEmpty()
    .withMessage('Поле "secondAngle" не має бути пустим')
    .isFloat({ min: 0, max: 360 })
    .withMessage('Поле "secondAngle" має бути числом'),
  body("type")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "type" має бути рядком'),
  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "description" має бути рядком'),
  body("frequency")
    .notEmpty()
    .withMessage('Поле "frequency" не має бути пустим')
    .isNumeric()
    .withMessage('Поле "frequency" має бути числом'),
  body("distance")
    .notEmpty()
    .withMessage('Поле "distance" не має бути пустим')
    .isNumeric()
    .withMessage('Поле "distance" має бути числом'),
];

module.exports = function (app) {
  app.post(
    "/targets",
    authMiddleware,
    validateBodyTarget,
    validateMiddleware,
    intersectionController.createOrUpdateTarget,
  );

  app.get(
    "/coworkingtargets",
    authMiddleware,
    validateQuery,
    validateMiddleware,
    intersectionController.getCoworkingWithTargets,
  );

  app.get(
    "/targets",
    authMiddleware,
    validateQuery,
    validateMiddleware,
    intersectionController.getTargets,
  );

  app.delete(
    "/targets",
    authMiddleware,
    validateQuery,
    validateMiddleware,
    intersectionController.removeTarget,
  );

  app.post(
    "/intersections",
    authMiddleware,
    validateBodyPoint,
    validateMiddleware,
    intersectionController.createIntersection,
  );

  app.get(
    "/intersections",
    authMiddleware,
    validateQuery,
    validateMiddleware,
    intersectionController.getIntersections,
  );

  app.delete(
    "/intersections",
    authMiddleware,
    validateQuery,
    validateMiddleware,
    intersectionController.clearIntersections,
  );
};
