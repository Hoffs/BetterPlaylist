const router = require('express').Router();
const Joi = require('joi');

router.get('/', (req, res) => {
  const validatedLimit = Joi.number().greater(0).less(50).required()
    .validate(req.header('limit'));
  const limit = (validatedLimit.error) ? 20 : req.header('limit');
  const validatedPage = Joi.number().greater(0).required().validate(req.header('page'));
  const page = (validatedPage.error) ? 1 : req.header('page');

  req.playlist.getTracks(limit, page)
    .then((tracksData) => {
      res.setHeader('total-count', tracksData.total);
      res.setHeader('limit', limit);
      res.setHeader('page', page);
      return res.status(200).json(tracksData.data);
    })
    .catch(() => res.status(409).json({ code: 409, message: 'Coudln\'t retrieve tracks.' }));
});

router.post('/', (req, res) => {
  const result = Joi.array().items(Joi.string().alphanum()).required().validate(req.body);
  if (result.error || req.body.length === 0) {
    return res.status(400).send({ code: 400, message: "Invalid track id's." });
  }

  return req.playlist.addTracks(req.authUser.get('accessToken'), ...req.body)
    .then(added => res.status(200).json({ added }))
    .catch(() => res.status(409).json({ code: 409, message: "Couldn't successfully add tracks." }));
});

router.delete('/:track_id', (req, res) => {
  const track = req.params.track_id;
  const result = Joi.string().alphanum().validate(track);
  if (result.error) {
    return res.status(400).send({ code: 400, message: 'Invalid track id.' });
  }

  return req.playlist.removeTracks(track)
    .then(() => res.status(200).json({ code: 200 }))
    .catch(() => res.status(400).json({ code: 400, message: 'Couldn\'t remove track.' }));
});

module.exports = router;
