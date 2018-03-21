const Joi = require('joi');
const { User } = require('./schemas');

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
  const result = await User.findByToken(token);
  if (!result) {
    return res.status(401).send({ code: 401, message: 'Unauthorized.' });
  }
  if (await result.isTokenExpired()) {
    await result.refreshAccessToken();
  }
  req.authUser = result;
  return next();
};
