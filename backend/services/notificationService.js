// notificationService.js
const redis = require("redis");
const publisher = redis.createClient();

function publishNotification(channel, message) {
  publisher.publish(channel, JSON.stringify(message));
}

module.exports = {
  publishNotification,
};
