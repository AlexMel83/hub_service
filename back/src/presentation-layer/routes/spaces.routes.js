const spacesController = require("../controllers/spaces-controller");
const { body, query } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const upload = require("../../middlewares/upload");
const validateMiddleware = require("../../middlewares/validate-middleware");

const validateSpace = [
  body("space_name")
    .notEmpty()
    .withMessage("space_name is required")
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
    .withMessage('Поле "amount" має бути числом')
    .isInt({ min: 0 })
    .withMessage('Поле "amount" має бути більше або дорівнювати 0'),
  body("available_amount")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('Поле "available_amount" має бути числом')
    .isInt({ min: 0 })
    .withMessage('Поле "available_amount" має бути більше або дорівнювати 0')
    .custom((value, { req }) => {
      if (req.body.amount && value > req.body.amount) {
        throw new Error('Поле "available_amount" не може бути більше "amount"');
      }
      return true;
    }),
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
  app.get(
    "/spaces",
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
    spacesController.getSpaces,
  );

  app.post(
    "/spaces",
    authMiddleware,
    upload.single("space_photo"),
    validateSpace,
    body("coworking_id").notEmpty().withMessage("coworking_id is required"),
    validateMiddleware,
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
          `Перезапис поля 'coworking_id' зі значенням ${value} недозволено`,
        );
      }
      return true;
    }),
    validateMiddleware,
    spacesController.updateSpace,
  );

  app.delete(
    "/spaces",
    authMiddleware,
    query("id").notEmpty().withMessage("Id is required"),
    validateMiddleware,
    spacesController.removeSpace,
  );
};
