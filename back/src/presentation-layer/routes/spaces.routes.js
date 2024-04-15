const spacesController = require("../controllers/spaces-controller");
const { body, query, validationResult } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload");
const ApiError = require("../../exceptions/api-errors");

const validateSpace = [
  body("space_name")
    .notEmpty()
    .isString()
    .withMessage('Поле "space_name" має бути рядком'),
  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "description" має бути рядком'),
  body("space_photo")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "space_photo" має бути шляхом до файлу'),
  body("amount")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "amount" має бути числом'),
  body("first_price")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "first_price" має бути числом'),
  body("last_price")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "last_price" має бути числом'),
];

module.exports = function (app) {
  app.get("/spaces", spacesController.getSpaces);

  app.post(
    "/spaces",
    authMiddleware,
    upload.single("space_photo"),
    validateSpace,
    body("coworking_id").notEmpty().withMessage("coworking_id is required"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    spacesController.addSpace,
  );

  app.put(
    "/spaces",
    authMiddleware,
    upload.single("space_photo"),
    validateSpace,
    body("id").notEmpty().withMessage('Поле "id" обов\'язкове для заповнення'),
    body("coworking_id").custom((value, { req }) => {
      if ("coworking_id" in req.body) {
        throw new Error(
          `Перезапис поля 'coworking_id' зі значенням ${value} недопустима`,
        );
      }
      return true;
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    spacesController.updateSpace,
  );

  app.delete(
    "/spaces",
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
    spacesController.removeSpace,
  );
};
