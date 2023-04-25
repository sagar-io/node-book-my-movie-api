const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    minlength: 2,
    maxlength: 20,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 4,
    maxlength: 1024,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// // OOP:  Information expert Principle
userSchema.methods.generateToken = function() {
  return jwt.sign({_id: this._id, name: this.name, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
}

const User = mongoose.model("user", userSchema);


const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).alphanum().required(),
    email: Joi.string().min(2).max(20).required().email(),
    password: Joi.string().min(2).max(50).required(),
  });
  const label = "Password";
  return (
    schema.validate(user) &&
    passwordComplexity(undefined, label).validate(user.password)
  );
};

exports.User = User;
exports.validate = validate;
