const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-errors");

module.exports = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(
      ApiError.BadRequest("Помилка при валідації", errors.array()),
    );
  }
  next();
};
