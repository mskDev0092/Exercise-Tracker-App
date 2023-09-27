const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";
const { Schema, model } = mongoose;
const logSchema = new Schema({
  username: String,
  count: Number,
  _id: ObjectId,
  log: [
    {
      description: String,
      duration: Number,
      date: Date,
    },
  ],
});

const Log = mongoose.model("Log", logSchema);
export default Log;
