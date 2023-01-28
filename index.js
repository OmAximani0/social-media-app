const express = require("express");
const morgan = require("morgan")

// Configure environment variable
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(morgan("dev"))

// Setup Routes
const UserRoutes = require("./routes/user.routes")
app.use(UserRoutes)

app.get("/", (req, res) => {
  res.send("Welcome to my Social Media App");
});

app.listen(PORT, () => {
  console.log(`[ SERVER ] : http://127.0.0.1:${PORT} is ready !`);
});
