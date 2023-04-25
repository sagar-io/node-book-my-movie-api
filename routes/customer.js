const express = require('express')
const router = express.Router()
const {Customer, validate} = require('../model/customer')

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name')
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send("customer not found with given id")
    res.send(customer)
})
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    const { isGold, name, phone } = req.body
    let customer = new Customer(
        {
            isGold,
            name,
            phone,
        })
    try {
        await customer.validate()
        customer = await customer.save()
        res.send(customer)
    }
    catch (err) {
        res.status(404).send(`Error Occured: ${err}`)
    }
})
router.put('/:id', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(404).send(error.details[0].message)

    const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
    )

    if (!updatedCustomer) return res.status(404).send("User Not found with given id")
    res.send(updatedCustomer)
})
router.delete('/:id', async (req, res) => {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id)
    if (!deletedCustomer) return res.status(404).send('Customer not found with given id')
    res.send(deletedCustomer)
})
module.exports = router