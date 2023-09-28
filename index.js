import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import User from "./models/USER.js";
import Exercise from "./models/EXERCISE.js";
const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
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
  const data = req.body;
  // Create a new user
  const user = new User(data);

  // Save the user to the database
  await user
    .save()
    .then((i) => {
      res.json({ username: user.username, _id: user.id });
    })
    .catch((err) => {
      res.status(400).send("Not saved!");
    });
});
// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Post exercises

router.post("/users/:_id/exercises", async (req, res) => {
  // Handle input
  const data = req.body;
  // Create a new user
  const user = User.find();
  const exercise = new Exercise(data);

  // Save the user to the database
  await exercise
    .save()
    .then((i) => {
      res.json({
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date,
        _id: user.id,
      });
    })
    .catch((err) => {
      res.status(400).send("Not saved!");
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
