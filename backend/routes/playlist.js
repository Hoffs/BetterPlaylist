var express = require('express');
var router = express.Router();
const Joi = require('joi');
const uuidv4 = require('uuid/v4');
const tracksRouter = require('./playlistTracks');

const playlistCreateSchema = Joi.object({
    name: Joi.string().min(5).max(100).required(),
    description: Joi.string().min(5).max(300).required()
});

const createPlaylist = (token, name, description) => {
    // TODO: Create playlist in database.
    return {
        id: uuidv4(),
        name: name,
        description: description,
        exportedName: null,
        exportedId: null,
        tracks: [],
        subPlaylists: [],
        createDate: new Date(),
        modifyDate: new Date()
    }
}

// POST /playlist/
router.post('/', (req, res) => {
    const result = Joi.validate(req.body, playlistCreateSchema);
    if (result.error) {
        return res.status(400).send({code: 400, message: "Invalid playlist name or description."})
    }
    
    const playlist = createPlaylist(req.myToken, req.body.name, req.body.description);
    if (!playlist) {
        return res.status(409).send({code: 409, message: "Couldn't create the playlist."});
    }
    res.status(200).send(playlist);
});

const getUserPlaylists = (token, limit, page) => {
    // TODO: Get actual user and retrieve its playlists.
    return {total_count: 0, results: [{id: '1234'}]};
}

router.get('/', (req, res) => {
    console.log("asd")
    const limit = req.header("limit") || 20;
    const page = req.header("page") || 1;
    const {total_count, results} = getUserPlaylists(req.myToken, limit, page);
    res.setHeader("total-count", total_count)
    res.setHeader("limit", limit);
    res.setHeader("page", page);
    res.status(200).send(results);
});

const getUserPlaylist = (token, id) => {
    // TODO: Check if user owns playlist and retrieve it.
    return null;
}

const verifyPlaylistMiddleware = (req, res, next) => {
    const result = Joi.string().guid('uuidv4').validate(req.params.id);
    if (result.error) {
        return res.status(400).send({code: 400, message: "Invalid playlist id."});
    }
    // Maybe add actual database checking for existing playlist. Would remove some errors further on.
    next();
}

router.post('/:id', verifyPlaylistMiddleware, (req, res) => {
    const playlist = getUserPlaylist(req.myToken, req.params.id);
    if (!playlist) {
        return res.status(404).send({code: 404, message: "Playlist not found."});
    }
    res.send(playlist);
});

const exportPlaylist = (token, id, name) => {
    // TODO: Actually retrieve and export playlist to users spotify account.
    return { spotify_uri: 'asd' }
}

const playlistUpdateSchema = Joi.object().keys({
    name: Joi.string().min(5).max(100),
    description: Joi.string().min(5).max(100),
    subPlaylists: Joi.array().items(Joi.string().uuid('uuidv4'))
});

const updatePlaylist = (token, id, updated) => {
    // TODO: Actually update playlist fields.
    return { id: '1234' };
}

router.put('/:id', verifyPlaylistMiddleware, (req, res) => {
    const result = Joi.validate(req.body, playlistUpdateSchema);
    if (result.error) {
        return res.status(400).send({code: 400, message: "Invalid field values."});
    }

    const playlist = updatePlaylist(req.myToken, req.params.id, req.body);
    if (!playlist) {
        return res.status(409).send({code: 409, message: "Couldn't update playlist. Maybe try changing the fields..."});
    }

    res.status(200).send(playlist);
});

router.post('/:id/export', verifyPlaylistMiddleware, (req, res) => {
    const exportName = req.body.name;
    const result = Joi.string().min(5).max(100).validate(exportName);
    if (result.error) {
        return res.status(400).send({code: 400, message: "Invalid playlist name."});
    }

    const exported = exportPlaylist(req.myToken, req.params.id, name);
    if (!exported) {
        return res.status(409).send({code: 409, message: "Couldn't export playlist. Maybe try changing the name..."})
    }

    res.status(200).send(exported);
})

router.use('/:id/tracks', verifyPlaylistMiddleware, tracksRouter);

module.exports = router;
