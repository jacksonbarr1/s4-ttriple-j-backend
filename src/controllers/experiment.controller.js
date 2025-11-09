const ABTestMetric = require('../models/abTestMetric.model');

const recordEvent = async (req, res, next) => {
  try {
    const { eventType, details = {} } = req.body;
    if (!eventType || typeof eventType !== 'string') {
      return res.status(400).json({ error: 'eventType is required' });
    }

    const allowed = ['assignment', 'switch_sort', 'scrolls_before_match', 'booking'];
    if (!allowed.includes(eventType)) {
      return res.status(400).json({ error: 'unsupported eventType' });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;
    const group = req.user && req.user.experiment ? req.user.experiment.group : null;

    const doc = await ABTestMetric.create({ user: userId, group, eventType, details });
    return res.status(201).json({ ok: true, event: doc });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  recordEvent,
};
