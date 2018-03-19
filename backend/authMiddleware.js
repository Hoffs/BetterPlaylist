const Joi = require('joi');
const db = require('./dbSchemas');

module.exports = async (req, res, next) => {
  const full = req.header('Authorization');
  if (!full) {
    return res.status(401).send({ code: 401, message: 'Invalid authorization token.' });
  }
  const token = full.split(' ')[1];
  const validate = Joi.string().alphanum().length(64).validate(token);
  if (validate.error) {
    return res.status(401).send({ code: 401, message: 'Invalid authorization token.' });
  }
  const result = db.User.findByToken(token);
  if (!result) {
    return res.status(401).send({ code: 401, message: 'Unauthorized.' });
  }
  req.authUser = result;
  return next();
};
