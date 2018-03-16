var express = require('express');
var router = express.Router();
const authMiddleware = require('../authMiddleware');
const Joi = require('joi');

const getTrack = (track_id) => {
  // TODO: Get track from database.
  return { id: "1234asdf" }
}

router.post('/:spotify_id', authMiddleware, function(req, res, next) {
  const id = req.params.spotify_id;
  const result = Joi.string().alphanum().validate(id); // Same as Base62
  if (result.error) {
      return res.status(400).send({code: 400, message: "Invalid track id."});
  }

  const track = getTrack(id);
  if (!track) {
    return res.status(404).send({code: 404, message: "Track not found."})
  }

  res.send(track);
});

module.exports = router;
