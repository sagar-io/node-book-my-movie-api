const mongoose = require('mongoose')
const Joi = require('joi')
const {genreSchema} = require('./genres')

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255
    }
}))

const validateMovie = (movie) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.string().min(0).max(255),
        dailyRentalRate: Joi.string().min(0).max(255),
    })
    return schema.validate(movie)
}

exports.Movie = Movie
exports.validateMovie = validateMovie