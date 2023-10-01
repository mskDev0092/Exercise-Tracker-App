import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import User from "./models/USER.js";
import Exercise from "./models/EXERCISE.js";

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
dotenv.config();

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/views/index.html");
});
mongoose.set("strictQuery", false);

async function connectToDb() {
  await mongoose.connect(process.env.URI);
}
// Make sure the database is connected before using Mongoose
await connectToDb(console.log("DB Connected!"));

app.use("/api", router);

// Create users
router.post("/users", async (req, res) => {
  // Handle input

  // Create a new user
  const userObj = new User({ username: req.body.username });

  // Save the user to the database
  try {
    const user = await userObj.save();
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).send("Not saved!");
  }
});
// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find();

  // API response

  res.send(users);
});

// Post exercises

router.post("/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;
  try {
    const user = await User.findById(id);
    // Handle input
    if (!user) {
      res.send("Invalid request!");
    } else {
      // Create a new user exe
      const exerciseObj = new Exercise({
        user_id: user._id,

        description,
        duration,
        date: date ? new Date(date) : new Date(),
      });

      // Save the user exe to the database
      const exercise = await exerciseObj.save();

      res.json({
        _id: user._id,
        username: user.username,
        date: new Date(exercise.date).toDateString(),
        duration: exercise.duration,
        description: exercise.description,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Not saved!");
  }
});

router.get("/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;
  const user = await User.findById(id);
  let search = {
    user_id: id,
  };
  let dateObj = {};

  if (!user) {
    console.log(err);
    res.send("Invalid request!");
    return;
  }
  if (from) {
    dateObj["$gte"] = new Date(from);
  }
  if (to) {
    dateObj["$lte"] = new Date(to);
  }
  if (from || to) {
    search.date = dateObj;
  }
  const userExercises = await Exercise.find(search).limit(+limit ?? 20);

  const logs = userExercises.map((c) => ({
    description: c.description,
    duration: c.duration,
    date: c.date.toDateString(),
  }));

  res.json({
    _id: user._id,
    username: user.username,
    count: userExercises.length,
    log: logs,
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
