const express = require("express");
const router = express.Router();
const { User } = require("../model/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth")

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("Invalid User or Password");

  const passMatched = await bcrypt.compare(password, user.password);
  if (!passMatched) res.status(401).send("Invalid Password");

  const token = user.generateToken()
  res.send(token);
});

function validate(authReq) {
  const schema = Joi.object({
    email: Joi.string().email().max(100).required(),
    password: Joi.string().min(4).max(100).required(),
  });
  return schema.validate(authReq);
}

module.exports = router;
