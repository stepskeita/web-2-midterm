const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Permission key is required'],
      unique: true,
      enum: ['create', 'edit', 'delete', 'publish', 'view'],
      trim: true,
      lowercase: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Permission', permissionSchema);
