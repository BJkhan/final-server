import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from './../Models/ProductModel.js';
import {protect, admin} from "../Middleware/AuthMiddlerware.js";

const productRoute = express.Router();
// api/products/
// Get all products
productRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
      const count = await Product.countDocuments({ ...keyword });
      const products = await Product.find({ ...keyword })
        .skip(pageSize * (page - 1))
        .limit(pageSize)
        .sort({ _id: -1 });
      res.json({ products, page, pages: Math.ceil(count / pageSize) });
  })
);

// ADMIN GET ALL PRODUCT WITHOUT SEARCH AND PEGINATION
productRoute.get(
  "/all",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products);
  })
);

// Get single product   
productRoute.get(
    "/:id",
    asyncHandler(async (req, res)=>{
        const product = await Product.findById(req.params.id);
        if (product){
            res.json(product);
        }else{
            res.status(404);
            throw new Error("Product not found");
        }
       
    })
);

// PRODUCT REVIEW
productRoute.post(
    "/:id/review",
    protect,
    asyncHandler(async (req, res) => {
      const { rating, comment } = req.body;
      const product = await Product.findById(req.params.id);
  
      if (product) {
        const alreadyReviewed = product.reviews.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
          res.status(400);
          throw new Error("Product already Reviewed");
        }
        const review = {
          name: req.user.name,
          rating: Number(rating),
          comment,
          user: req.user._id,
        };
  
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
  
        await product.save();
        res.status(201).json({ message: "Reviewed Added" });
      } else {
        res.status(404);
        throw new Error("Product not Found");
      }
    })
  );  
// DELETE PRODUCT
productRoute.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product deleted" });
    } else {
      res.status(404);
      throw new Error("Product not Found");
    }
  })
);

// CREATE PRODUCT
productRoute.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const {
      name,
      image,
      additionalImages,
      description,
      price,
      countInStock,
      SKU,
      priceOff,
      onSale,
      category,
      dressType,
      mainDressSize,
      dressSize,
      dressStyle,
      patternType,
      dressLength,
      material,
      sleeveLength,
      mainColor,
      additionalColors,
    } = req.body;
    const productExist = await Product.findOne({ name });
    if (productExist) {
      res.status(400);
      throw new Error("Product name already exist");
    } else {
      // const trimmedName = name.trim();
      // const trimmedDescription = description.trim();
      // const trimmedColor = mainColor.trim();
      // const trimmedImage = image.trim();
      // const trimmedAdditionalImages = additionalImages.trim();
      const product = new Product({
        name: name,
        SKU,
        price,
        priceOff,
        description: description,
        image: image,
        countInStock,
        onSale,
        category,
        dressType,
        mainDressSize,
        dressSize,
        dressStyle,
        patternType,
        dressLength,
        material, 
        sleeveLength,
        mainColor: mainColor,
        color: additionalColors || [],
        user: req.user._id,
        additionalImages: additionalImages || [],
        
      });
      if (product) {
        const createdproduct = await product.save();
        res.status(201).json(createdproduct);
      } else {
        res.status(400);
        throw new Error("Invalid product data");
      }
    }
  })
);

// UPDATE PRODUCT
productRoute.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, price, priceOff, description, image, countInStock, onSale } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.priceOff = priceOff || product.priceOff;
      product.description = description || product.description;
      product.image = image || product.image;
      product.countInStock = countInStock || product.countInStock;
      product.onSale = req.body.onSale !== undefined ? onSale : false;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);
export default productRoute;

