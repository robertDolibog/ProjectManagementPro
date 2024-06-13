const Ably = require("ably");

const ably = new Ably.Realtime(
  "xVLyHw.00HsfQ:bq5YGlV4yNLolf91oNITZggRz0M7fNi24rzOLsTFklo"
);

function createAblyConnection() {
  return new Promise((resolve, reject) => {
    ably.connection.once("connected", () => {
      console.log("Connected to Ably!");
      resolve(ably);
    });

    ably.connection.once("failed", (err) => {
      console.error("Failed to connect to Ably:", err);
      reject(err);
    });
  });
}

module.exports = createAblyConnection;
