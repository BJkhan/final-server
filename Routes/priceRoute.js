import express from 'express';
import asyncHandler from 'express-async-handler';
import PriceSettings from './../Models/PriceModel.js';

const priceSettingsRoute = express.Router();
// get payment options
priceSettingsRoute.get(
    "/",
    asyncHandler(async (req, res) => {
        const priceOptions = await PriceSettings.find({});
        const passedPrice = priceOptions[0];
        res.json({passedPrice});
    })
  );
//   priceSettingsRoute.post(
//     "/",
//     asyncHandler(async (req, res) => {
//     //     const {shipping, tax} = req.body;
//     //   const payOption = await PaymentOptions.findById(req.params.id);
  
//     //   if (payOption) {
//     //     payOption.isActive = !payOption.isActive;
//     //     await payOption.save();
//     //     res.json({ payOption });
//     //   } else {
//     //     res.status(404).json({ message: "Payment option not found" });
//     //   }
//     const shipping = 150;
//     const tax = 0.12;
//         const newPrices = new PriceSettings({
//             shipping: shipping,
//             tax: tax,
//         }); 
//         const createdTaxes =  await newPrices.save();
//         res.status(201).json(createdTaxes);
//     })
//   );


  priceSettingsRoute.put(
    "/",
    asyncHandler(async (req, res) => {
      const { shipping, tax } = req.body;
      const taxId = 1992;
      const result = await PriceSettings.findOne({taxId: taxId});
      if (result) {
        result.shipping = shipping || result.shipping;
        result.tax = tax || result.tax;
        const updatedPrices = await result.save();
        res.status(201).json(updatedPrices);
      } else {
        res.status(404);
        throw new Error("price updation error");
      }
    })
  );

export default priceSettingsRoute;