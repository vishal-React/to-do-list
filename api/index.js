const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/user.js");
const postRoute = require("./routes/posted.js");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const url = process.env.url;

app.get("/", (req, res) => {
  res.send("Hello");
});

const connect = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/routes/user", authRoute);
app.use("/routes/posted", postRoute);

app.listen(8000, () => {
  console.log("connected to backed");
  connect();
});
