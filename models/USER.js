const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";
const { Schema, model } = mongoose;
const userSchema = new Schema({
  username: { type: String, required: true },
  _id: ObjectId,
});

const User = mongoose.model("Users", userSchema);
export default User;
