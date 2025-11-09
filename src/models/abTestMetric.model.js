const mongoose = require('mongoose');

const abTestMetricSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    group: { type: String, enum: ['A', 'B'], required: false },
    eventType: { type: String, required: true }, // assignment | switch_sort | scrolls_before_match | booking
    details: { type: Object, default: {} },
  },
  { timestamps: true }
);

const ABTestMetric = mongoose.model('ABTestMetric', abTestMetricSchema);

module.exports = ABTestMetric;
