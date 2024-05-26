const paymentsController = require("../controllers/payments-controller");
const authMiddleware = require("../../middlewares/auth-middleware");
const { param, query, body } = require("express-validator");
const validateMiddleware = require("../../middlewares/validate-middleware");

const ValidatePayments = [
  query("id")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("id is number"),
  query("coworkingId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("coworkingId is number"),
  query("spaceId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("spaceId is number"),
  query("userId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("userId is number"),
];

const ValidatePaymentBody = [
  body("id")
    .notEmpty()
    .withMessage('Поле "id" обов\'язкове для заповнення')
    .isNumeric()
    .withMessage("id must be a number"),
  body("description")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("description must be a string"),
  body("payment_reference")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage("payment_reference must be a string"),
];

module.exports = function (app) {
  app.post(
    "/payments/:link",
    async (req, res, next) => {
      const isAuth = req.get("authorization")?.split(" ")[0] === "Bearer";
      if (isAuth) {
        await authMiddleware(req, res, next);
      } else {
        next();
      }
    },
    param("link").isUUID(4).withMessage("Invalid activation link format"),
    validateMiddleware,
    paymentsController.activate,
  );

  app.get(
    "/payments",
    async (req, res, next) => {
      const isAuth = req.get("authorization")?.split(" ")[0] === "Bearer";
      if (isAuth) {
        await authMiddleware(req, res, next);
      } else {
        next();
      }
    },
    ValidatePayments,
    validateMiddleware,
    paymentsController.getPayments,
  );

  app.put(
    "/payments",
    authMiddleware,
    ValidatePaymentBody,
    validateMiddleware,
    paymentsController.updatePayment,
  );

  app.delete(
    "/payments",
    authMiddleware,
    query("id")
      .notEmpty()
      .withMessage("id is required")
      .isNumeric()
      .withMessage("id must be a number"),
    validateMiddleware,
    paymentsController.deletePayment,
  );
};
