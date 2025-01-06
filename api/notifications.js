const NotificationService = require("../services/notification-service");
const { SubscribeMessage } = require("../utils");

const notificationRoutes = (app, channel) => {
  const service = new NotificationService();

  SubscribeMessage(channel, service);
};

module.exports = notificationRoutes;