var express = require('express');
var router = express.Router();
const db = require('../dbSchemas');

router.get('/', (req, res) => {
  db.User.findById(req.authUser.get('_id'), 'spotifyId displayName imageUrl')
    .then(result => {
      return res.status(200).send(result.toJSON());
    })
    .catch(err => {
      return res.status(404).send({code: 404, message: "Couldn't retrieve user."})
    })
});

module.exports = router;
