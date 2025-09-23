const mongoose = require('mongoose');

const hazardReportSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  hazardType: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for geospatial queries
hazardReportSchema.index({ latitude: 1, longitude: 1 });

// Index for status queries
hazardReportSchema.index({ status: 1 });

// Index for createdBy queries
hazardReportSchema.index({ createdBy: 1 });

module.exports = mongoose.model('HazardReport', hazardReportSchema);

