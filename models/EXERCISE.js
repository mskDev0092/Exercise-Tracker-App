import mongoose from "mongoose";
const { Schema, model } = mongoose;

const exerciseSchema = new Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
  _id: ObjectId,
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
