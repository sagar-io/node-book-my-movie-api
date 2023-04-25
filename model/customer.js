const mongoose = require('mongoose')
const Joi = require('joi')

const Customer = mongoose.model('customer', new mongoose.Schema({
    isGold: {type: Boolean, default: false},
    name: { type: String, trim: true, required: true },
    phone: { type: Number, length: 10 },
}))

const validateCustomer = (customer) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(255).required(),
        isGold: Joi.boolean(),
        phone: Joi.number()
    })
    return schema.validate(customer)
}

exports.Customer = Customer
exports.validate = validateCustomer