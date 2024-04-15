const bookingsController = require("../controllers/bookings-controller");
const authMiddleware = require("../../middlewares/auth-middleware");
const { body, query, validationResult } = require("express-validator");
const ApiError = require("../../exceptions/api-errors");
const phoneRegex = /^380\d{9}$/;

const validateBooking = [
  body("spaceId").notEmpty().isNumeric().withMessage("spaceId is required"),
  body("startTime")
    .notEmpty()
    .withMessage("Start time is required")
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date"),
  body("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .isISO8601()
    .withMessage("End time must be a valid ISO 8601 date"),
  body("timeslotId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("timeslotId is number"),
  body("seats")
    .notEmpty()
    .withMessage("seats is required")
    .isNumeric()
    .withMessage("seats is number"),
  body("totalPrice")
    .notEmpty()
    .isNumeric()
    .withMessage("totalPrice is required"),
  body("is_paid")
    .optional({ checkFalsy: true })
    .default(false)
    .isBoolean()
    .withMessage("status must be a boolean"),
  body("status")
    .optional({ checkFalsy: true })
    .default("new")
    .isString()
    .withMessage("status must be a string"),
];

const validateGuest = [
  body("firstName").notEmpty().isString().withMessage("firstName is required"),
  body("lastName").notEmpty().isString().withMessage("lastName is required"),
  body("email").notEmpty().isEmail().withMessage("email is required"),
  body("phone")
    .notEmpty()
    .matches(phoneRegex)
    .withMessage('Поле "phone" має формат 380123456789'),
];

const validateUpdate = [
  body("id")
    .notEmpty()
    .withMessage("id is required")
    .isNumeric()
    .withMessage("id must be a number"),
  body("spaceId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("spaceId must be a number"),
  body("startTime")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Start time must be a valid ISO 8601 date"),
  body("endTime")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("End time must be a valid ISO 8601 date"),
  body("timeslotId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("timeslotId must be a number"),
  body("seats")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("seats must be number"),
  body("totalPrice")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("totalPrice must be a number"),
  body("isPaid")
    .optional({ checkFalsy: true })
    .isBoolean()
    .withMessage("isPaid must be a boolean"),
  body("status")
    .optional({ checkFalsy: true })
    .default("new")
    .isString()
    .withMessage("status must be a string"),
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
  query("guestId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("guestId is number"),
  query("spaceId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("spaceId is number"),
  query("coworkingId")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("coworkingId is number"),
  query("startDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("startDate must be a valid ISO 8601 date"),
  query("endDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("endDate must be a valid ISO 8601 date"),
];

const getBookingValidation = (isAuth) => {
  return isAuth ? validateBooking : [...validateBooking, ...validateGuest];
};

module.exports = function (app) {
  app.post(
    "/bookings",
    async (req, res, next) => {
      const isAuth = req.get("authorization")?.split(" ")[0] === "Bearer";
      if (isAuth) {
        await authMiddleware(req, res, next);
      } else {
        next();
      }
    },
    (req, res, next) => {
      const validations = getBookingValidation(req.isAuth);
      Promise.all(validations.map((validation) => validation.run(req))).then(
        () => {
          next();
        },
      );
    },
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    bookingsController.createBooking,
  );

  app.get(
    "/bookings",
    validateQuery,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(ApiError.BadRequest("Помилка при валідації", errors.array()));
      } else next();
    },
    async (req, res, next) => {
      const isAuth = req.get("authorization")?.split(" ")[0] === "Bearer";
      if (isAuth) {
        await authMiddleware(req, res, next);
      } else next();
    },
    async (req, res) => {
      if (req?.user?.id && req.query.userId) {
        await bookingsController.getBookingsByUserId(req, res);
      } else if (req.query.guestId) {
        await bookingsController.getBookingsByGuestId(req, res);
      } else if (req.query.id) {
        await bookingsController.getBookingById(req, res);
      } else if (req.query.spaceId) {
        await bookingsController.getBookingsBySpaceId(req, res);
      } else if (req.query.coworkingId) {
        await bookingsController.getBookingsByCoworkingId(req, res);
      } else if (req.query.startDate && req.query.endDate) {
        await bookingsController.getBookingsByDateRange(req, res);
      } else {
        await bookingsController.getAllBookings(req, res);
      }
    },
  );

  app.put(
    "/bookings",
    authMiddleware,
    validateUpdate,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    bookingsController.updateBooking,
  );

  app.delete(
    "/bookings",
    authMiddleware,
    query("id")
      .notEmpty()
      .withMessage("id is required")
      .isNumeric()
      .withMessage("id must be a number"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(
          ApiError.BadRequest("Помилка при валідації", errors.array()),
        );
      }
      next();
    },
    bookingsController.deleteBooking,
  );
};
