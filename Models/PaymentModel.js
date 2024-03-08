import mongoose from "mongoose";

const paymentModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            default: "PayPal"
          },
        isActive: {
            type: Boolean,
            default: true,
          },
    }
);
const PaymentOptions = mongoose.model("PaymentOptions", paymentModel);

export default PaymentOptions;