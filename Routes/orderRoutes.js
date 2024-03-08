import express, { response } from "express";
import asyncHandler from "express-async-handler";
import {protect,admin} from "../Middleware/AuthMiddlerware.js";
import Order from "./../Models/OrderModel.js";
import axios from "axios";
import { randomBytes } from 'node:crypto';
import { generateSignature } from "../Middleware/generateSigPayFast.js"
import Product from "../Models/ProductModel.js";
const orderRouter = express.Router();

// Function to generate a random ID
const generateRandomId = () => {
  return randomBytes(8).toString('hex');
};

// CREATE ORDER
orderRouter.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
      return;
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  })
);

// pay with payfast
orderRouter.post('/payfast', asyncHandler(async(req, res) => {
 try{
  const { name, email, orderId, amount } = req.body
  const myData = [];
  myData["merchant_id"] = "10032120";
  myData["merchant_key"] = "6civpttxd2jid";
  // myData["return_url"] = "http://www.yourdomain.co.za/return_url";
  // myData["cancel_url"] = "http://www.yourdomain.co.za/cancel_url";
  // myData["notify_url"] = "http://www.yourdomain.co.za/notify_url";
  myData["name_first"] = `${name}`;
  myData["email_address"] = `${email}`;
  myData["m_payment_id"] = `${generateRandomId()}`;
  myData["amount"] = `${amount}`;
  myData["item_name"] = `${orderId}`;
  const myPassphrase = "bk1992sandbox";
  myData["signature"] = generateSignature(myData, myPassphrase);
  
  let htmlForm = `<form action="https://sandbox.payfast.co.za/eng/process" method="post">`;
  for (let key in myData) {
    if(myData.hasOwnProperty(key)){
      let value = myData[key];
      if (value !== "") {
        htmlForm +=`<input name="${key}" type="hidden" value="${value.trim()}" />`;
      }
    }
  }
  
  htmlForm += '<input type="submit" class="btn btn-outline-success" value="Pay with PayFast Now" /></form>';
  res.send(htmlForm)
 } catch (error){
  throw new Error("No order items");
      return;
 }
}));

// ADMIN GET ALL ORDERS
orderRouter.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .sort({ _id: -1 })
      .populate("user", "id name email");
    res.json(orders);
  })
);
// USER LOGIN ORDERS

orderRouter.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(order);
  })
);

// Plutu.ly Sadad API endpoint for payment initiation
orderRouter.post('/initiate-payment', async (req, res) => {
  const { Category, Amount, Msisdn, BirthYear, InvoiceNo } = req.body;
  const API_KEY = process.env.API_KEY;
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const url = 'https://api.plutus.ly/api/v1/transaction/sadadapi/verify';
  const headers = {
    'X-API-KEY': API_KEY,
    'Authorization': `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json' // Change content type to JSON
  };
  
  const requestData = {
    InvoiceNo,
    Category,
    mobile_number: Msisdn,
    amount: Amount,
    birth_year: BirthYear
  };
 
  axios.post(url, requestData, { headers })
  .then(response => {
    res.send(response.data)
  })
  .catch(error => {
    console.error('Error:', error.response ? error.response.data : error.message)
  });
});


// plutu confirm payment
orderRouter.post('/pay-invoice', async (req, res) => {
  const { otp, Amount, InvoiceNo, process_id } = req.body;

  const apiUrl = "https://api.plutus.ly/api/v1/transaction/sadadapi/confirm";

  const formData = {
    code: otp,
    amount: Amount,
    invoice_no: InvoiceNo,
    process_id: process_id,
  };

  const headers = {
    "X-API-KEY": process.env.API_KEY,
    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(apiUrl, formData, { headers })
    .then((response) => {
      res.send(response.data)
    })
    .catch((error) => {
      console.error('Error:', error.response ? error.response.data : error.message)
    });

})

// GET ORDER BY ID
orderRouter.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER IS PAID BY PAYPAL & plutu
orderRouter.put(
  "/:id/pay",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = "Confirmed"
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      // Update the number of sold items for each product in the order
      await Promise.all(
        order.orderItems.map(async (item) => {
          const product = await Product.findById(item.product);

          if (product) {
            product.sold = (product.sold || 0) + item.qty;
            await product.save();
          }
        })
      );

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

// ORDER DELIVER
orderRouter.put(
  "/:id/delivered",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order && order.isPaid) {
      order.orderStatus = "Delivered"
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found / Paument due");
    }
  })
);

// ORDER STATUS
orderRouter.put(
  "/:id/status",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.orderStatus;
      order.statusChangedAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order Not Found");
    }
  })
);

export default orderRouter;
