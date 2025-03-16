const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=200&h=200&fit=crop" },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);