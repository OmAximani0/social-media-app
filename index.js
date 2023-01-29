const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("./config/passport");

// Configure environment variable
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());

// Setup Routes
const UserRoutes = require("./routes/user.routes");
app.use(UserRoutes);

mongoose.connect(process.env.ATLAS_URI);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.get("/", (req, res) => {
  res.send("Welcome to my Social Media App");
});

app.listen(PORT, () => {
  console.log(`[ SERVER ] : http://127.0.0.1:${PORT} is ready !`);
});
