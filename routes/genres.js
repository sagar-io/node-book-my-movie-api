const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../model/genres");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin")

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name").limit(100).select({ name: 1 });

  res.send(genres);
});
router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id).select("name");

  if (!genre) return res.status(404).send("Genre not exist!");
  res.send(genre);
});
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });
  try {
    await genre.validate();
    genre = await genre.save();
    res.send(genre);
  } catch (err) {
    for (errfields in err) res.status(404).send(err[errfields].message);
  }
});
router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const updatedGenre = await Genre.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  if (!updatedGenre)
    return res.status(404).send("Genre not found with the given id");
  res.send(updatedGenre);
});
router.delete("/:id", [auth, admin] , async (req, res) => {
  const deletedGenre = await Genre.findByIdAndRemove(req.params.id);
  if (!deletedGenre)
    return res.status(404).send("Genre doesn't exist that is to be deleted!");
  res.send(deletedGenre);
});
module.exports = router;
