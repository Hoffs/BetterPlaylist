const router = require('express').Router();
const Joi = require('joi');
const tracksRouter = require('./playlistTracks');
const { User, Playlist } = require('../schemas');

const playlistCreateSchema = Joi.object({
  name: Joi.string().min(5).max(100).required(),
  description: Joi.string().min(5).max(300).required(),
});

router.post('/', (req, res) => {
  const result = Joi.validate(req.body, playlistCreateSchema);
  if (result.error) {
    return res.status(400).send({ code: 400, message: 'Invalid playlist name or description.' });
  }

  return Playlist.createWith(req.body.name, req.body.description)
    .then(playlist => req.authUser.addPlaylist(playlist))
    .then((added) => {
      if (!added) {
        return res.status(404).json({ code: 404, message: 'Couldn\'t add playlist.' });
      }
      return res.status(201).json({
        id: added.get('_id'),
        name: added.get('name'),
        description: added.get('description'),
        exportedName: added.get('exportedName'),
        exportedId: added.get('exportedId'),
      });
    })
    .catch(() => res.status(409).send({ code: 409, message: "Couldn't create the playlist." }));
});

router.get('/', (req, res) => {
  const validatedLimit = Joi.number().greater(0).less(50).required()
    .validate(req.header('limit'));
  const limit = (validatedLimit.error) ? 20 : req.header('limit');
  const validatedPage = Joi.number().greater(0).required().validate(req.header('page'));
  const page = (validatedPage.error) ? 1 : req.header('page');
  req.authUser.getPlaylists(limit, page)
    .then((playlists) => {
      res.setHeader('total-count', playlists.total);
      res.setHeader('limit', limit);
      res.setHeader('page', page);
      return res.status(200).json(playlists.data);
    })
    .catch(() => res.status(400).json({ code: 400, message: "Couldn't retrieve playlists." }));
});

const verifyPlaylistMiddleware = async (req, res, next) => {
  const result = Joi.string().alphanum().length(24).validate(req.params.id);
  if (result.error) {
    return res.status(400).send({ code: 400, message: 'Invalid playlist id.' });
  }
  const playlist = await Playlist.findById(req.params.id).select('name description exportedName exportedId tracks').exec();
  if (!playlist) {
    return res.status(404).send({ code: 404, message: 'Playlist not found.' });
  }
  const ownsPlaylist = await User.findById(req.authUser.get('_id')).select('playlists').where('playlists', playlist.get('_id')).exec();
  if (!ownsPlaylist) {
    return res.status(403).send({ code: 403, message: 'Playlist doesn\'t belong to you.' });
  }
  req.playlist = playlist;
  return next();
};

/*
 Playlist updating, deleting, etc.
*/

router.get('/:id', verifyPlaylistMiddleware, (req, res) => {
  res.status(200).json({
    id: req.playlist.id,
    name: req.playlist.name,
    description: req.playlist.description,
    exportedName: req.playlist.exportedName,
    exportedId: req.playlist.exportedId,
    trackCount: req.playlist.tracks.length,
  });
});

const playlistUpdateSchema = Joi.object().keys({
  name: Joi.string().min(5).max(100),
  description: Joi.string().min(5).max(300),
  subPlaylists: Joi.array().items(Joi.string().alphanum().length(24)),
});

router.put('/:id', verifyPlaylistMiddleware, (req, res) => {
  const result = Joi.validate(req.body, playlistUpdateSchema);
  if (result.error) {
    return res.status(400).send({ code: 400, message: 'Invalid field values.' });
  }

  if (req.body.name) {
    req.playlist.set('name', req.body.name);
  }
  if (req.body.description) {
    req.playlist.set('description', req.body.description);
  }
  if (!req.playlist.isModified('name') && !req.playlist.isModified('description')) {
    return res.status(200).json({
      id: req.playlist.id,
      name: req.playlist.name,
      description: req.playlist.description,
      exportedName: req.playlist.exportedName,
      exportedId: req.playlist.exportedId,
      trackCount: req.playlist.tracks.length,
    });
  }
  return req.playlist.save()
    .then(updated => res.status(200).json({
      id: updated.id,
      name: updated.name,
      description: updated.description,
      exportedName: updated.exportedName,
      exportedId: updated.exportedId,
      trackCount: updated.tracks.length,
    }))
    .catch(() => res.status(409).json({ code: 409, message: 'Couldn\'t successfully update playlist.' }));
});

router.delete('/:id', verifyPlaylistMiddleware, (req, res) => {
  req.authUser.deletePlaylist(req.playlist.get('_id'))
    .then(() => res.status(200).json({ code: 200 }))
    .catch(() => res.status(400).json({ code: 400, message: "Coudln't delete playlist." }));
});

router.post('/:id/export', verifyPlaylistMiddleware, (req, res) => {
  const exportName = req.body.name;
  const result = Joi.string().min(5).max(100).validate(exportName);
  if (result.error) {
    return res.status(400).json({ code: 400, message: 'Invalid playlist name.' });
  }

  return req.playlist.exportToSpotify(req.authUser.get('spotifyId'), req.authUser.get('accessToken'), exportName)
    .then(uri => res.status(200).json(uri))
    .catch(() => res.status(409).json({ code: 409, message: "Couldn't successfully export playlist." }));
});

router.use('/:id/tracks', verifyPlaylistMiddleware, tracksRouter);

module.exports = router;
