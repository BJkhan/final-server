import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    SKU: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      default: "defaultImage.png"
    },
    additionalImages: [String],
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    priceOff: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
      default: "Pents"
    },
    color: [String],
    mainColor: {
      type: String,
      required: true,
      default: "Black"
    },
    dressType: {
      type: String,
      required: true,
      default: "Abaya"
    },
    mainDressSize: {
      type: String,
      required: true,
      default: "L"
    },
    dressSize: [String],

    dressStyle: {
      type: String,
      required: true,
      default: "Work"
    },
    patternType: {
      type: String,
      required: true,
      default: "Plain"
    },
    dressLength: {
      type: String,
      required: true,
      default: "Short"
    },
    material: {
      type: String,
      required: true,
      default: "Cotton"
    },
    sleeveLength: {
      type: String,
      required: true,
      default: "Long Sleeve"
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
