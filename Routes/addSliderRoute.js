import express from "express";
import asyncHandler from "express-async-handler";
import Sliders from "../Models/SliderModel.js";

const addSliderRoute = express.Router();

// Endpoint to fetch slide data
addSliderRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const slides = await Sliders.find({})
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
        .limit(5); // Limit the result to 5 sliders
      res.json({ slides });
  })
);
// Endpoint to add slide data
addSliderRoute.post(
  "/",
  asyncHandler(async (req, res) => {
    const slides = req.body.slides;
    if (!Array.isArray(slides)) {
      return res.status(400).json({ message: "Invalid slides data" });
    }
    const createdSlides = [];
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      try {
        const newSlide = new Sliders({
          url: slide.imageUrl,
          caption: slide.caption,
          slideNumber: i + 1, // Slide number starts from 1
        });
        const savedSlide = await newSlide.save();
        createdSlides.push(savedSlide);
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Failed to add slide to the database" });
      }
    }
    res.status(201).json({ message: "Slides added successfully" });
  })
);
export default addSliderRoute;
