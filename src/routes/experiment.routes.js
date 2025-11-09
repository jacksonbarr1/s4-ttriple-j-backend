const express = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const experimentController = require('../controllers/experiment.controller');

const router = express.Router();

router.post(
  '/record',
  authenticate,
  [body('eventType').isString().notEmpty(), body('details').optional().isObject()],
  validate,
  experimentController.recordEvent,
);

module.exports = router;
