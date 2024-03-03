import mongoose from "mongoose";

const priceModel = mongoose.Schema(
    {
        taxId:{
          type: Number,
          required: true,
          default: 1992,
        },
        shipping: {
            type: Number,
            required: true,
            default: 0,
          },
        tax: {
            type: Number,
            required: true,
            default: true,
          },
    }
);
const PriceSettings = mongoose.model("Prices", priceModel);

export default PriceSettings;