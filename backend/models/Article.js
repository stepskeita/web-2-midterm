const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title is required'],
      trim: true
    },
    body: {
      type: String,
      required: [true, 'Article body is required']
    },
    image: {
      type: String,
      default: null
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Article author is required']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Article', articleSchema);
