import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
});

// Save hashed version of password
UserSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10); // number of bytes that will be generated in the hash
  this.password = await bcryptjs.hash(this.password, salt);
});

// Creates a JWT token for a user
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, username: this.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Verifies if password matches hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

export const model = mongoose.model("User", UserSchema);
