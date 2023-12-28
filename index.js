const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const path = require("path");
const app = express();

// Use environment variables for sensitive information
const mongoDBConnectionString = process.env.MONGODB_URI || "mongodb+srv://41071105H:41071105H@cluster0.h9q2tfk.mongodb.net/test";
app.use(cors());
// // Enable CORS for a specific origin
// app.use(cors({
//   origin: 'https://azuremern.azurewebsites.net',
//   credentials: true, // You might need to include this depending on your use case
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build directory
app.use(express.static('./client/build'));

// For any other route, serve the React app's index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

mongoose.connect(mongoDBConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Database is connected..."))
  .catch((err) => console.log(err));


const userSchema = new mongoose.Schema({
  user_name: String,
  user_birthday: Date,
  user_phone: String,
  user_email: String,
  user_password: String,
});

const UserModel = mongoose.model("User", userSchema);

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Create a new user
app.post("/createUser", cors(), (req, res) => {
  const userData = req.body;
  UserModel.create(userData)
    .then((newUser) => {
      console.log("User Created with ID: " + newUser._id);
      res.status(200).send("User created successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error creating user");
    });
});

app.get("/users", (req, res) => {
  UserModel.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching users");
    });
});

// Update a user by ID
app.put("/updateUser/:id", (req, res) => {
  const id = req.params.id;
  const updatedUserData = req.body;

  UserModel.findByIdAndUpdate(id, updatedUserData, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.send(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error updating user");
    });
});

app.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const isValidObjectId = ObjectId.isValid(id);

    if (!isValidObjectId) {
      return res.status(400).send("Invalid user ID");
    }

    const result = await UserModel.findByIdAndRemove(id);
    if (!result) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

// searching users by name
app.get("/searchUsersByName", (req, res) => {
  const searchName = req.query.name; // Get the name to search for from query parameters
  UserModel.find({ user_name: { $regex: searchName, $options: "i" } }) // Case-insensitive search
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error searching for users by name");
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
require("dotenv").config();