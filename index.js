const express = require("express");
const app = express();
const mongoose = require("mongoose");
const print = console.log;
const cors = require("cors");
const port = process.env.PORT || 8004;
const notificationRoutes = require("./api/notifications");
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

const { CreateChannel, SubscribeMessage } = require("./utils");

require("dotenv").config();
app.use(express.urlencoded({ extended: true }));

async function startApp() {
  try {
    await mongoose.connect(process.env.DB_URI);
    print("Database connection established");

    const channel = await CreateChannel();

    await notificationRoutes(app, channel);
    app.listen(port, () => {
      console.log(`Notification Service is listening on port ${port}`);
    });
  } catch (err) {
    console.log("Failed to start app:", err);
  }
}

startApp();