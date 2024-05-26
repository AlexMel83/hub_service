const userController = require("../controllers/user-controller");
const { body, param, query } = require("express-validator");
const authMiddleware = require("../../middlewares/auth-middleware");
const phoneRegex = /^380\d{9}$/;
const validateMiddleware = require("../../middlewares/validate-middleware");

const validateUser = [
  body("email")
    .notEmpty()
    .isEmail()
    .isAscii()
    .withMessage('Поле "email" має формат email@email.ua'),
  body("password")
    .optional({ checkFalsy: true })
    .isString()
    .isLength({ min: 4, max: 32 }),
  body("name")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "name" має бути рядком'),
  body("surname")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "surname" має бути рядком'),
  body("phone")
    .optional({ checkFalsy: true })
    .matches(phoneRegex)
    .withMessage('Поле "phone" має формат 3801234567'),
  body("role")
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Поле "role" має бути рядком'),
];

module.exports = function (app) {
  app.post(
    "/registration",
    validateUser,
    validateMiddleware,
    userController.registration,
  );

  app.post("/login", validateUser, validateMiddleware, userController.login);

  app.post("/logout", userController.logout);
  app.get("/activate/:link", userController.activate);
  app.get("/refresh", userController.refresh);
  app.get(
    "/users",
    authMiddleware,
    query("id").notEmpty().withMessage("Id is required"),
    validateMiddleware,
    userController.getUser,
  );

  app.put(
    "/users",
    authMiddleware,
    validateUser,
    body("id").notEmpty().withMessage("Id is required"),
    validateMiddleware,
    userController.editUser,
  );

  app.delete(
    "/users/:user_id",
    authMiddleware,
    param("user_id").exists().isNumeric(),
    validateMiddleware,
    userController.deleteUser,
  );
};
