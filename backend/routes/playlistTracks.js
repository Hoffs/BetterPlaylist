var express = require('express');
var router = express.Router();
const authMiddleware = require('../authMiddleware');
const Joi = require('joi');

const getPlaylistTracks = (token, id, limit, page) => {
  // TODO: Get actual user and retrieve its playlists.
  return {total_count: 0, results: []};
}

router.get('/', (req, res) => {
  const limit = req.header("limit") || 20;
  const page = req.header("page") || 1;
  const {total_count, results} = getPlaylistTracks(req.myToken, id, limit, page);
  res.setHeader("total-count", total_count)
  res.setHeader("limit", limit);
  res.setHeader("page", page);
  res.status(200).send(results);
});

const addPlaylistTracks = (token, id, tracks) => {
  // TODO: Add new tracks to database and add them to playlist.
  return [{id: '1234'}];
}

router.post('/', (req, res) => {
  const result = Joi.array().items(Joi.string().alphanum()).validate(req.body);
  if (result.error) {
    return res.status(400).send({code: 400, message: "Invalid track id's."})
  }

  const added = addPlaylistTracks(req.myToken, req.params.id, req.body);
  if (!added) {
    return res.status(409).send({code: 409, message: "Couldn't add tracks to playlist."});
  }

  res.status(200).send(added);
})

const deletePlaylistTrack = (token, id, track_id) => {
  // TODO: Remove track from playlist.
  return true;
}

router.delete('/:track_id', (req, res) => {
  const track = req.params.track_id;
  const result = Joi.string().alphanum().validate(track);
  if (result.error) {
    return res.status(400).send({code: 400, message: "Invalid track id."});
  }

  const deleted = deletePlaylistTrack(req.myToken, req.params.id, track);
  if (!deleted) { // Probably only happens if track doesn't exist in playlist.
  return res.status(404).send({code: 404, message: "Track not found."});
}

return res.status(200).send({code: 200});
});

module.exports = router;
