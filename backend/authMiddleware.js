const Joi = require('joi');

const verifyToken = (token) => {
    return true; // TODO: Verify token against database.
}

module.exports = (req, res, next) => {
    const full = req.header("Authorization");
    if (!full) {
        return res.status(401).send({code: 401, message: "Invalid authorization token."})
    }
    const token = full.split(" ")[1];
    const validate = Joi.string().length(60).validate(token);
    if (validate.error) {
        return res.status(401).send({code: 401, message: "Invalid authorization token."})
    }  
    if (!verifyToken(token)) {
        return res.status(401).send({code: 401, message: "Unauthorized."})
    }
    req.myToken = token;
    next();
}