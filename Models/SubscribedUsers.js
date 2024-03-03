import mongoose from "mongoose";

const subsUser = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
const SubscribedUser = mongoose.model("SubscribedUsers", subsUser);

export default SubscribedUser;
