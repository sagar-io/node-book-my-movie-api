const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { User, validate } = require("../model/user");
const bcrypt = require("bcrypt");
const auth = require("../middlewares/auth")

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')
  res.send(user)
})

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already exist.");

  const { name, email, password, isAdmin } = req.body;
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt);

  user = new User({
    name,
    email,
    password: hash,
    isAdmin
  });

  try {
    await user.validate();
    await user.save();

    const token = user.generateToken()
    res.header({"x-auth-key": token}).send(_.pick(user, ["_id", "name", "email"]));
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
