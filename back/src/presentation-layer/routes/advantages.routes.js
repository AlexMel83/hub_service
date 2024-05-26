const advantagesController = require("../controllers/advantages-controller");
const { body, query } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload");
const validateMiddleware = require("../../middlewares/validate-middleware");

const validateAdvantage = [
  body("name").notEmpty().isString().withMessage('Поле "name" має бути рядком'),
  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "description" має бути рядком'),
  body("icon")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "icon" має бути шляхом до файлу'),
];

module.exports = function (app) {
  app.get(
    "/advantages",
    query("id")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("id is number"),
    query("coworking_id")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("coworking_id is number"),
    validateMiddleware,
    advantagesController.getAdvantages,
  );

  app.post(
    "/advantages",
    authMiddleware,
    upload.single("icon"),
    validateAdvantage,
    validateMiddleware,
    advantagesController.addAdvantage,
  );

  app.put(
    "/advantages",
    authMiddleware,
    upload.single("icon"),
    validateAdvantage,
    body("id")
      .notEmpty()
      .withMessage("Id is required")
      .isNumeric()
      .withMessage("id is number"),
    validateMiddleware,
    advantagesController.updateAdvantage,
  );

  app.delete(
    "/advantages",
    authMiddleware,
    query("id")
      .notEmpty()
      .withMessage("Id is required")
      .isNumeric()
      .withMessage("id is number"),
    validateMiddleware,
    advantagesController.deleteAdvantage,
  );
};
