const router = require('express').Router();
const authMiddleware = require('../authMiddleware');
const Joi = require('joi');
const { Track } = require('../schemas');

router.get('/:spotify_id', authMiddleware, (req, res) => {
  const id = req.params.spotify_id;
  const result = Joi.string().alphanum().validate(id); // Same as Base62
  if (result.error) {
    return res.status(400).send({ code: 400, message: 'Invalid track id.' });
  }

  return Track.findBySpotifyId(id)
    .then((tracks) => {
      if (tracks.length === 0) {
        return res.status(404).send({ code: 404, message: 'Track not found.' });
      }
      return res.status(200).json({
        id: tracks[0].id,
        name: tracks[0].name,
        durationMs: tracks[0].durationMs,
        artist: tracks[0].artist,
        album: tracks[0].album,
      });
    })
    .catch(() => res.status(404).send({ code: 404, message: 'Track not found.' }));
});

module.exports = router;
