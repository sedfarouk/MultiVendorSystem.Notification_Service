const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      enum: ["email", "push", "sms"],
      default: "email",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to update `updatedAt` on save
NotificationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;