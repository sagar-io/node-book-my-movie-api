const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../model/rentals");
const { Customer } = require("../model/customer");
const { Movie } = require("../model/movies");
const mongoose = require("mongoose");
// const Fawn = require("fawn");
// Fawn.init("mongodb://0.0.0.0/vidly");

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("title");
  res.send(rentals);
});
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("No rental found with given id !");
  res.send(rental);
});
router.post("/", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  const movie = await Movie.findById(req.body.movieId);

  if (!customer || !movie)
    return res.status(400).send("movieId or customerId doesn't exist.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is out of stock.");

  const { name, phone, isGold } = customer;
  const { title, dailyRentalRate } = movie;
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name,
      phone,
      isGold,
    },
    movie: {
      _id: movie._id,
      title,
      dailyRentalRate,
    },
  });

  try {
    await rental.validate();
    //// transaction
    const session = await mongoose.startSession();
    session.withTransaction(async () => {
      const savedRental = await rental.save();
      movie.numberInStock--;
      movie.save();
      res.send(savedRental)
    });

    session.endSession();
  } catch (err) {
    res.status(500).send(`internal Server error, ${err}`);
  }
});
router.put("/:id", async (req, res) => {
  let rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send("No rental found with given id");

  const { error } = validateRental(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  const movie = await Movie.findById(req.body.movieId);

  if (!customer || !movie)
    return res.status(404).send("movieId or customerId doesn't exist.");

  if (movie.numberInStock === 0)
    return res.status(404).send("Movie is out of stock.");

  const { name, phone, isGold } = customer;
  const { title, dailyRentalRate } = movie;
  rental = await Rental.findByIdAndUpdate(
    rental._id,
    {
      customer: {
        _id: customer._id,
        name,
        phone,
        isGold,
      },
      movie: {
        _id: movie._id,
        title,
        dailyRentalRate,
      },
    },
    { new: true }
  );
  res.send(rental);
});
router.delete("/:id", async (req, res) => {
  const deletedRental = await Rental.findByIdAndDelete(req.params.id);
  if (!deletedRental)
    return res.status(404).send("No rental associated with given id");
  res.send(deletedRental);
});

module.exports = router;
