const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new Error(
        `Validation failed: ${errors
          .array()
          .map((err) => err.msg)
          .join(", ")}`,
      ),
    );
  }
  return next();
};

module.exports = validate;
