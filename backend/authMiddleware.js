// const router = require('express').Router();
const verifyToken = (token) => {
    return true; // TODO: Verify token against database.
}

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).send({code: 401, message: "Invalid authorization token."})
    }  
    if (!verifyToken(token)) {
        return res.status(401).send({code: 401, message: "Unauthorized."})
    }
    next();
}