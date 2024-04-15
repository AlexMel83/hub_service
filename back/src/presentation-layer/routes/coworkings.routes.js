const coworkingsController = require("../controllers/coworkings-controller");
const { body, query, validationResult } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload");
const phoneRegex = /^380\d{9}$/;
const ApiError = require("../../exceptions/api-errors");

const validateCoworks = [
  body("coworking_name")
    .notEmpty()
    .isString()
    .withMessage('Поле "coworking_name" має бути рядком'),
  body("address")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "address" має бути рядком'),
  body("phone")
    .optional({ checkFalsy: true })
    .matches(phoneRegex)
    .withMessage('Поле "phone" має формат 380123456789'),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .isAscii()
    .withMessage('Поле "email" має формат email@email.ua'),
  body("social")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "social" має бути рядком'),
  body("coworking_photo")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "coworking_photo" має бути шляхом до файлу'),
  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "description" має бути числом'),
  body("first_price")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "first_price" має бути числом'),
  body("last_price")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "last_price" має бути числом'),
  body("workday")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "workday" має бути числом'),
  body("weekend")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "weekend" має бути числом'),
  body("hour")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "hour" має бути числом'),
  body("amount")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "amount" має бути числом'),
  body("start_work")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "start_work" має бути числом'),
  body("end_work")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "end_work" має бути числом'),
  body("workday_start")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "workday_start" має бути числом'),
  body("workday_end")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "workday_end" має бути числом'),
  body("dayoff_start")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "dayoff_start" має бути числом'),
  body("dayoff_end")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "dayoff_end" має бути числом'),
  body("published")
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage('Поле "published" має бути boolean'),
];

module.exports = function (app) {
  app.get("/coworkings", coworkingsController.getCoworkings);

  app.post(
    "/coworkings",
    authMiddleware,
    upload.single("coworking_photo"),
    validateCoworks,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    coworkingsController.addCoworking,
  );

  app.put(
    "/coworkings",
    authMiddleware,
    upload.single("coworking_photo"),
    validateCoworks,
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
    coworkingsController.updateCoworking,
  );

  app.delete(
    "/coworkings",
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
    coworkingsController.removeCoworking,
  );
};
