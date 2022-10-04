const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const feedRoutes = require("./routes/feed");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/feed", feedRoutes);

mongoose
  .connect("mongodb+srv://azmammad:ylqqNP7wRWq29Tuq@cluster0.6rwjomi.mongodb.net/messages")
  .then((result) => {
    console.log("connected!");
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
