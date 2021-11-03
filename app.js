const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");

const HttpError = require("./models/http-error")
const userRoutes = require("./routes/User");

const app = express();
const upload = multer();

app.use(upload.array());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown error occured" });
});

const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.y7u3n.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Database Connection Ready");
    app.listen(process.env.PORT || 3000);
  })
  .then(() => {
    console.log("App Listening on 3000");
  })
  .catch((err) => {
    console.log(err);
  });
