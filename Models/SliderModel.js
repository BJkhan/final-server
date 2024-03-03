import mongoose from "mongoose";

const sliderSchema = mongoose.Schema({
  slideNumber: {
    type: Number, // Slide number field
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
}
);
const Sliders = mongoose.model("Sliders", sliderSchema);

export default Sliders;
