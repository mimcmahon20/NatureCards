// Import modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// Set the web server
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get(
  "/",
  (req, res) => res.send("<h1>NatureCards: Server</h1>") // Home web page
);
// Connect to MongoDB database
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://naturecardsdev:nature123@naturecards.chz2p.mongodb.net/?retryWrites=true&w=majority&appName=naturecards",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.once("open", function () {
  console.log("Connection with MongoDB was successful");
});
// Create routes for database access
const tableSchema = require("./model");
const router = express.Router();

app.use("/db", router);

// Route to create a card
router.post("/card/create", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.body.userId);
    user.cards.push(req.body.card);
    await user.save();
    res.status(201).json(user.cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to add a friend
router.post("/friend/add", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.body.userId);
    user.friends.push(req.body.friendId);
    await user.save();
    res.status(201).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get the friends array
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.params.userId);
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to update the entire card array
router.post("/cards/update", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.body.userId);
    user.cards = req.body.cards;
    await user.save();
    res.status(200).json(user.cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get the card array
router.get("/cards/:userId", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.params.userId);
    res.status(200).json(user.cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle login
router.post("/login", async (req, res) => {
  try {
    const user = await tableSchema.findOne({ username: req.body.username });
    if (user && user.password === req.body.password) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get user information
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to handle signup
router.post("/signup", async (req, res) => {
  try {
    const newUser = new tableSchema(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(response);
  }
});

// Route to create a trade
router.post("/trade/create", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.body.userId);
    user.trading.requests.push(req.body.trade);
    await user.save();
    res.status(201).json(user.trading.requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to remove a trade
router.post("/trade/remove", async (req, res) => {
  try {
    const user = await tableSchema.findById(req.body.userId);
    user.trading.requests = user.trading.requests.filter(
      (trade) => trade._id.toString() !== req.body.tradeId
    );
    await user.save();
    res.status(200).json(user.trading.requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the app to be used in bin/www.js
module.exports = app;
