const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reporter: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true
  },
  assignedTo: {
    type: String,
    trim: true,
    default: null
  },
  stepsToReproduce: {
    type: String,
    trim: true,
    maxlength: [500, 'Steps to reproduce cannot exceed 500 characters']
  },
  expectedBehavior: {
    type: String,
    trim: true,
    maxlength: [300, 'Expected behavior cannot exceed 300 characters']
  },
  actualBehavior: {
    type: String,
    trim: true,
    maxlength: [300, 'Actual behavior cannot exceed 300 characters']
  },
  environment: {
    type: String,
    trim: true,
    maxlength: [200, 'Environment cannot exceed 200 characters']
  },
  tags: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    author: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for bug age
bugSchema.virtual('age').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Index for better query performance
bugSchema.index({ status: 1, priority: 1, createdAt: -1 });
bugSchema.index({ title: 'text', description: 'text' });

// Pre-save middleware for validation
bugSchema.pre('save', function (next) {
  // Ensure tags are unique
  if (this.tags) {
    this.tags = [...new Set(this.tags)];
  }
  next();
});

// Static method to get bugs by status
bugSchema.statics.getBugsByStatus = function (status) {
  return this.find({ status });
};

// Instance method to add comment
bugSchema.methods.addComment = function (author, content) {
  this.comments.push({ author, content });
  return this.save();
};

// Instance method to update status
bugSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  return this.save();
};

module.exports = mongoose.model('Bug', bugSchema);