const coworkingsController = require("../controllers/coworkings-controller");
const { body, query } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload");
const phoneRegex = /^380\d{9}$/;
const validateMiddleware = require("../../middlewares/validate-middleware");

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
    .withMessage('Поле "description" має бути рядком'),
  body("first_price")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "first_price" має бути числом'),
  body("last_price")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "last_price" має бути числом'),
  body("workday")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "workday" має бути числом'),
  body("weekend")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "weekend" має бути числом'),
  body("hour")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "hour" має бути числом'),
  body("amount")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "amount" має бути числом'),
  body("start_work")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "start_work" має бути рядком'),
  body("end_work")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "end_work" має бути рядком'),
  body("workday_start")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "workday_start" має бути рядком'),
  body("workday_end")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "workday_end" має бути рядком'),
  body("dayoff_start")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "dayoff_start" має бути рядком'),
  body("dayoff_end")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "dayoff_end" має бути рядком'),
  body("published")
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage('Поле "published" має бути boolean'),
];

module.exports = function (app) {
  app.get(
    "/coworkings",
    query("id")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("id is number"),
    query("user_id")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("user_id is number"),
    query("name")
      .optional({ checkFalsy: true })
      .isString()
      .withMessage("name is string"),
    validateMiddleware,
    coworkingsController.getCoworkings,
  );

  app.post(
    "/coworkings",
    authMiddleware,
    upload.single("coworking_photo"),
    validateCoworks,
    validateMiddleware,
    coworkingsController.addCoworking,
  );

  app.put(
    "/coworkings",
    authMiddleware,
    upload.single("coworking_photo"),
    validateCoworks,
    body("id").notEmpty().withMessage("Id is required"),
    validateMiddleware,
    coworkingsController.updateCoworking,
  );

  app.delete(
    "/coworkings",
    authMiddleware,
    query("id").notEmpty().withMessage("Id is required"),
    validateMiddleware,
    coworkingsController.removeCoworking,
  );
};
