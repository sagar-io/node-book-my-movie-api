const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const home = require("./routes/home");
const genre = require("./routes/genres");
const customer = require("./routes/customer");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const user = require("./routes/user");
const auth = require("./routes/auth");
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey not defined !");
  process.exit(1);
}

mongoose
  .connect(config.get('db'))
  .then(() => console.log("connected to mongodb..."))
  .catch((err) => console.error(err.message));

app.use(express.json());
app.use("/", home);
app.use("/api/genres?", genre);
app.use("/api/customers?", customer);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/register", user);
app.use("/api/auth", auth);
require('./startup/prod')(app)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on Port ${PORT}...`));
module.exports = mongoose;
