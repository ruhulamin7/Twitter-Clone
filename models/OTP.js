// dependencies

const { mongoose } = require('mongoose');

// OTP Schema
const OTPSchema = new mongoose.Schema(
  {
    OTP: {
      type: Number,
      required: true,
      trim: true,
      minLength: 4,
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OTP = new mongoose.model('OTP', OTPSchema);
module.exports = OTP;
