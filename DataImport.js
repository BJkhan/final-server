import express from "express";
import User from "./Models/UserModel.js";
import users from "./data/users.js";
import Product from "./Models/ProductModel.js";
import products from "./data/Products.js";
import PaymentModel from "./Models/PaymentModel.js"
import paymentOptions from "./data/PayOptions.js"
import asyncHandler from "express-async-handler";
import Order from "./Models/OrderModel.js"

const ImportData = express.Router();

ImportData.post(
  "/user",
  asyncHandler(async (req, res) => {
    await User.remove({});
    const importUser = await User.insertMany(users);
    res.send({ importUser });
  })
);

ImportData.post(
  "/products",
  asyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const importProducts = await Product.insertMany(products);
    res.send({ importProducts });
  })
);

ImportData.post(
  "/payOptions",
  asyncHandler(async (req, res) => {
    await PaymentModel.deleteMany({});
    const importPaymentOptions = await PaymentModel.insertMany(paymentOptions);
    res.send({ importPaymentOptions });
  })
);

ImportData.post(
  "/orders",
  asyncHandler(async (req, res) => {
    await Order.deleteMany({});
    res.send("Removed all orders")
  })
);

export default ImportData;
