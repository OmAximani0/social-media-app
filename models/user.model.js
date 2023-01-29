const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
  },
});

UserSchema.methods.validatePassword = async (pass) => {
  return await bcrypt.compare(pass, this.password);
};

module.exports = mongoose.model("user", UserSchema);
