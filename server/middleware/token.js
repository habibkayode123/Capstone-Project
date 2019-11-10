const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createToken = (payload = {
    see: "in action"
}) => {
    return jwt.sign(payload, process.env.secret)

}
const decodeToken = (req, resp, next) => {
    let token = req.headers.token
    let data = jwt.decode(token)

    if (data == null) {
        resp.statusCode = 400
        return resp.json({status:"Error",
    error:"permission denial"})
    }
    req.data = data

    next()



}
module.exports = {
    createToken,
    decodeToken,
}