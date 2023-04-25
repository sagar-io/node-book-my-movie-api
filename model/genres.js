const Joi = require('joi')
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
})

const Genre = mongoose.model('genre', genreSchema)

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(20).required()
    })
    return schema.validate(genre)
}

const deleteGenre = async (id) =>
    await Genre.deleteOne({ id })

exports.Genre = Genre
exports.genreSchema = genreSchema
exports.validate = validateGenre