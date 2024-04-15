const advantagesController = require("../controllers/advantages-controller");
const { body, query, validationResult } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload");
const ApiError = require("../../exceptions/api-errors");

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
  app.get("/advantages", advantagesController.getAdvantages);

  app.post(
    "/advantages",
    authMiddleware,
    upload.single("icon"),
    validateAdvantage,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    advantagesController.addAdvantage,
  );

  app.put(
    "/advantages",
    authMiddleware,
    upload.single("icon"),
    validateAdvantage,
    body("id").notEmpty().withMessage("Id is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    advantagesController.updateAdvantage,
  );

  app.delete(
    "/advantages",
    authMiddleware,
    query("id").notEmpty().withMessage("Id is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    advantagesController.deleteAdvantage,
  );
};
