import mongoose from "mongoose";
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  description: String,
  duration: Number,
  date: Date,
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
