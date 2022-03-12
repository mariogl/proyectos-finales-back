const { model, Schema } = require("mongoose");
const userDataMinimums = require("../../server/utils/constants");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: userDataMinimums.name,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: userDataMinimums.username,
  },
  password: {
    type: String,
    required: true,
    minlength: userDataMinimums.password,
  },
});
const User = model("User", UserSchema, "users");

module.exports = User;
