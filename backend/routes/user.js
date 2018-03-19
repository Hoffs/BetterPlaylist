const router = require('express').Router();
const db = require('../dbSchemas');

router.get('/', (req, res) => {
  db.User.findById(req.authUser.get('_id'), 'spotifyId displayName imageUrl')
    .then(result => res.status(200).send(result.toJSON()))
    .catch(() => res.status(404).send({ code: 404, message: "Couldn't retrieve user." }));
});

module.exports = router;
