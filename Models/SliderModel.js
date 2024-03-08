import mongoose from "mongoose";

const sliderSchema = mongoose.Schema({
  slideNumber: {
    type: Number, // Slide number field
    required: true,
    default: 0,
  },
  url: {
    type: String,
    required: true,
    default: "sliderImage",
  },
  caption: {
    type: String,
    required: true,
    default: "sliderImage",
  },
},
{
  timestamps: true,
}
);
const Sliders = mongoose.model("Sliders", sliderSchema);

export default Sliders;
