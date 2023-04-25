const express = require('express')
const router = express.Router()
const { Movie, validateMovie } = require('../model/movies')
const { Genre } = require('../model/genres')
const mongoose = require('mongoose')

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title').limit(50)
    res.send(movies)
})
router.get('/:id', async (req, res) => {
    const isValidId = mongoose.isValidObjectId(req.params.id)
    if (!isValidId) return res.status(404).send("Please enter valid object id")
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send("No movie exist for this id")

    res.send(movie)
})
router.post('/', async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    const { title, genreId, numberInStock, dailyRentalRate } = req.body

    const isValidId = mongoose.isValidObjectId(genreId)
    if (!isValidId) return res.status(404).send("Please enter valid object id")

    const genre = await Genre.findById(genreId)
    if (!genre) return res.status(404).send("genre doesn't exist with given id")

    let movie = new Movie({
        title,
        genre: {
            _id: genreId,
            name: genre.name
        },
        numberInStock,
        dailyRentalRate
    })
    try {
        await movie.validate()
        movie = await movie.save()
        res.send(movie)
    }
    catch (err) {
        res.send(`Error Occured: ${err}`)
    }
})
router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    const { title, genreId, numberInStock, dailyRentalRate } = req.body

    const isValidId = mongoose.isValidObjectId(genreId)
    if (!isValidId) return res.status(404).send("Please enter valid object id")

    const genre = await Genre.findById(genreId)
    if (!genre) return res.status(404).send("genre doesn't exist with given id")

    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                title,
                genre: {
                    _id: genreId,
                    name: genre.name
                }
            }
        },
        { new: true }
    )
    if (!movie) return res.status(404).send("movie doesn't exist with given id")
    res.send(movie)
})
router.delete('/:id', async (req, res) => {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id)
    if (!deletedMovie) res.status(404).send("No movie found with given id")
    res.send(deletedMovie)
})

module.exports = router