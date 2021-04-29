const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    min:5,
  },
  password: {
    type: String,
    required: true
  },
  apiKey: [{
      type:String,
      required:true
  }],
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default : "user",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;