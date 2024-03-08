import express from "express";
import asyncHandler from "express-async-handler";
import  {protect, admin}  from "../Middleware/AuthMiddlerware.js";
import generateToken from "../utils/generateToken.js";
import User from "./../Models/UserModel.js";
import SubscribedUser from "../Models/SubscribedUsers.js";
const userRouter = express.Router();

// LOGIN
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        createdAt: user.createdAt,
        addressFirst: user.addressFirst,
        addressSecond: user.addressSecond,
        province: user.province,
        city: user.city,
        zipCode: user.zipCode,
        country:user.country,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  })
);

// REGISTER
userRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password, addressFirst, addressSecond, province, city, zipCode, country, currency } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      addressFirst,
      addressSecond,
      province,
      city,
      zipCode,
      country,
      currency,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
        addressFirst: user.addressFirst,
        addressSecond: user.addressSecond,
        province: user.province,
        city: user.city,
        zipCode: user.zipCode,
        country: user.country,
        currency: user.currency,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

// PROFILE
userRouter.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
        addressFirst: user.addressFirst,
        addressSecond: user.addressSecond,
        province: user.province,
        city: user.city,
        zipCode: user.zipCode,
        country: user.country
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// UPDATE PROFILE
userRouter.put(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = req.body.password;
        }
      user.addressFirst = req.body.addressFirst || user.addressFirst;
      user.addressSecond = req.body.addressSecond || user.addressSecond;
      user.province = req.body.province || user.province;
      user.country = req.body.country || user.country;
      user.city = req.body.city || user.city;
      user.zipCode = req.body.zipCode || user.zipCode;
     
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
        addressFirst: user.addressFirst,
        addressSecond: user.addressSecond,
        province: user.province,
        city: user.city,
        zipCode: user.zipCode,
        country: user.country
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

// SubscribedUsers
userRouter.post(
  "/subscribe",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const findSubscription = await SubscribedUser.findOne({ email });

    if (findSubscription) {
      res.status(400);
      throw new Error("You have already subscribed");
    }

    const newSubscription = await SubscribedUser.create({
      email,
    });

    if (newSubscription) {
      res.status(201).json({
        email: newSubscription.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

// GET ALL USER ADMIN
userRouter.get(
  "/subscribe",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const subcrUsers = await SubscribedUser.find({});
    res.json(subcrUsers);
  })
);

export default userRouter;
