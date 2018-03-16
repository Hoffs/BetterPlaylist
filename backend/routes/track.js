var express = require('express');
var router = express.Router();
const authMiddleware = require('../authMiddleware');
const Joi = require('joi');

router.post('/:spotify_id', authMiddleware, function(req, res, next) {
  const id = req.params.spotify_id;
  const result = Joi.string().alphanum().validate(id); // Same as Base62
  if (result.error) {
      return res.send({code: 400, message: "Invalid track id."});
  }
  res.send({track: id}); // TODO: Send track id.
});

module.exports = router;
