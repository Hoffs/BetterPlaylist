const mongoose = require('mongoose');
const Track = require('./track');
const spotify = require('../spotifyUtils');

const { Schema } = mongoose;

const playlistSchema = new Schema({
  name: String,
  description: String,
  exportedName: String,
  exportedId: String,
  tracks: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
  subPlaylists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  createDate: Date,
  modifyDate: Date,
});

playlistSchema.statics.createWith = async function createPlaylistWithNameAndDesc(name, desc = '') {
  const createDate = new Date();
  const result = await this.create({
    name,
    description: desc,
    exportedName: null,
    exportedId: null,
    tracks: [],
    subPlaylists: [],
    createDate,
    modifyDate: createDate,
  });
  return result;
};

playlistSchema.methods.addTracks = async function addTracksToPlaylist(accessToken, ...trackIds) {
  const missing = await Track.getMissing(...trackIds);
  if (missing && missing.length > 0) {
    const missingData = await spotify.getTrackData(accessToken, ...missing);
    await Track.insertTracks(...missingData);
  }
  const ids = await Track.getObjectIds(...trackIds);
  const playlist = await Playlist.findById(this.get('_id')).select('tracks').exec(); // eslint-disable-line no-use-before-define

  if (ids.length > 0) {
    playlist.tracks.push(...ids);
    await playlist.save();
  }
  return ids.length;
};

playlistSchema.methods.exportToSpotify =
async function exportPlaylistToSpotify(spotifyId, token, name) {
  const playlist = await Playlist.findById(this.get('_id')).select('tracks').exec(); // eslint-disable-line no-use-before-define
  await playlist.populate({ path: 'tracks', model: 'Track', select: 'id name' }).execPopulate();
  const exported = await spotify.exportSpotifyPlaylist(spotifyId, token, name, ...playlist.tracks);

  this.set({ exportedName: name, exportedId: exported.spotifyId });
  await this.save();
  return { spotify_uri: `spotify:playlist:${exported.spotifyId}` };
};

playlistSchema.methods.getTracks = async function getPlaylistTracks(limit, page = 1) {
  if (limit < 0 || page < 0) {
    return null;
  }
  const skipAmount = (page - 1) * limit;
  const playlist = await Playlist.findById(this.get('_id')).select('tracks').exec(); // eslint-disable-line no-use-before-define
  const total = playlist.tracks.length;
  await playlist.populate({
    path: 'tracks',
    model: 'Track',
    select: 'id name durationMs artist album',
    options: {
      skip: skipAmount,
      limit,
    },
  }).execPopulate();
  const data = playlist.tracks.map(x => ({
    id: x.id,
    name: x.name,
    durationMs: x.durationMs,
    artist: x.artist,
    album: x.album,
  }));
  return { total, data };
};

playlistSchema.methods.removeTracks = async function removePlaylistTracks(...trackIds) {
  if (trackIds.length === 0) {
    return 0;
  }
  const oIds = await Track.getObjectIds(...trackIds);
  await this.update({ $pull: { tracks: { $in: oIds } } }).exec();
  return trackIds.length;
};

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
