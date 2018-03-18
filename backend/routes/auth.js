const router = require('express').Router();
const Joi = require('joi');
const db = require('../dbSchemas');

schema = Joi.object().keys({
  code: Joi.string()
});

router.post('/', async (req, res) => {
  const result = Joi.validate(req.body, schema);
  if (result.error) {
    return res.status(420).send({code: 420, message: 'Invalid request body.'});
  }
  const user = await db.User.createOrUpdateWithCode(req.body.code);
  if (!user) {
    return res.status(400).send({code: 400, message: "Couldn't create or authenticate user."});
  }
  return res.status(200).send({token: user});
});

module.exports = router;
