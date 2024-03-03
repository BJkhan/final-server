import express from 'express';
import asyncHandler from 'express-async-handler';
import PaymentOptions from '../Models/PaymentModel.js';

const payOptionsRoute = express.Router();
// get payment options
payOptionsRoute.get(
    "/",
    asyncHandler(async (req, res) => {
        const payOptions = await PaymentOptions.find({});
        res.json({payOptions});
    })
  );
  payOptionsRoute.put(
    "/:id/toggle",
    asyncHandler(async (req, res) => {
      const payOption = await PaymentOptions.findById(req.params.id);
  
      if (payOption) {
        payOption.isActive = !payOption.isActive;
        await payOption.save();
        res.json({ payOption });
      } else {
        res.status(404).json({ message: "Payment option not found" });
      }
    })
  );

export default payOptionsRoute;