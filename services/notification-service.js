const NotificationRepository = require("../database/repository/notification-repository");
const { FormatData } = require("../utils");
const nodeMailer = require("nodemailer");
const Notification = require("../database/models/Notification");
require("dotenv").config();

class NotificationService {
  async sendCheckoutEmail(recipientEmail, orderId, items, amount) {
    let itemsBought = "";

    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: process.env.APP_PASSWORD,
        },
      });

      for (let i = 0; i < items.length; i++) {
        itemsBought += `${items[i].product.name}, `;
      }

      const mail = await transporter.sendMail({
        from: `"MultiVendorApp" <${process.env.EMAIL_ADDRESS}>`,
        to: recipientEmail,
        subject: "Order Confirmation",
        html: `<h3>Your order with ID ${orderId} has been placed successfully. The total amount is $${amount}. Items: ${itemsBought}. If you did not place this order, please contact support.</h3>`,
      });

      console.log("Email sent successfully:", mail.messageId);
    } catch (err) {
      console.error("Error sending email:", err);
    }

    const emailContent = `<h3>Your order with ID ${orderId} has been placed successfully. The total amount is $${amount}. Items: ${itemsBought}. If you did not place this order, please contact support.</h3>`;

    const notification = new Notification({
      recipient: recipientEmail,
      message: emailContent,
      notificationType: "email",
    });

    const newNotification = await notification.save();
    console.log("Notification saved:", newNotification);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    console.log("Received payload in Notification Service:", payload);
    const { event, data } = payload;
    const { userEmail, order } = data;

    switch (event) {
      case "SEND_CHECKOUT_CONFIRMATION_MAIL":
        this.sendCheckoutEmail(userEmail, order.orderId, order.items, order.amount);
        break;
    }
  }
}

module.exports = NotificationService;