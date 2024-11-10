const User = require("../models/User");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/error");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());

const register = async (req, res, next) => {
  try {
    console.log(req.body);
    if (typeof req.body.password !== 'string' || req.body.password.trim() === '') {
      return res.status(400).send("Password is required.");
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();

    res.status(201).send("User has been created.");
  } catch (err) {
    next(err);
  }
};


const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect){
      const errorDetails = "The password or username you entered is incorrect.";
      return next(createError(400, errorDetails));}
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ id: user._id,username:user.username, isAdmin: user.isAdmin }, secretKey);
    console.log("Generated token:", token);
    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, token, isAdmin });      //sending data to client
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
