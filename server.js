import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb.js";
import ImportData from "./DataImport.js";
import productRoute from "./Routes/ProductRoutes.js";
import { errorHandler, notFound } from "./Middleware/Errors.js";
import userRouter from "./Routes/UserRoutes.js";
import orderRouter from "./Routes/orderRoutes.js";
import payOptionsRoute from "./Routes/payOptionsRoutes.js";
import addSliderRoute from "./Routes/addSliderRoute.js"
import priceSettingsRoute from "./Routes/priceRoute.js"
import bodyParser from "body-parser";
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();
// connectDatabase();
async function connectDB(){
  try {
  const connection = await mongoose.connect('mongodb://127.0.0.1:27017/clothesshop', {
  });
  console.log("Connected to db");
  } catch (error) {
  console.error("Error not connected", error.message);
  }
  }
  
const app = express();
app.use(express.json());
app.use(cors());
// API
app.use(bodyParser.json());
app.use("/api/import", ImportData);
app.use("/api/products", productRoute);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/paymentOptions",payOptionsRoute)
app.use("/api/slides",addSliderRoute)
app.use("/api/price/settings",priceSettingsRoute)
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);
connectDB();
const PORT = process.env.PORT || 1000;

app.listen(PORT, console.log(`server run in port ${PORT}`));
