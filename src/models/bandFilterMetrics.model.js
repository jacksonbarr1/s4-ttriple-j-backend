const mongoose = require('mongoose');

const bandFilterMetricsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    sortStrategy: { type: String, required: true },
    filters: { type: Object, default: {} },
    search: { type: String, default: null },
    resultCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BandFilterMetrics = mongoose.model('BandFilterMetrics', bandFilterMetricsSchema);

module.exports = BandFilterMetrics;
