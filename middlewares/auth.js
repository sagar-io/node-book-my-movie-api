const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    const token = req.header('x-auth-key')
    if(!token) return res.status(401).send("Not have web Token in the header")

    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'))
        req.user = decodedPayload
        next()
    }
    catch(ex) {
        return res.status(400).send("Token Not matched !")
    }
}