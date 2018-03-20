const mongoose = require('mongoose');
const Track = require('./track');

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

playlistSchema.methods.addTracks = async function addTracksToPlaylist(tracks) {
  await Track.insertTracks(tracks);
  const ids = await Track.getObjectIds(tracks);
  const playlist = await Playlist.findById(this.get('_id')).select('tracks').exec(); // eslint-disable-line no-use-before-define
  /*
  const existingTrackIds = playlist.tracks.map(x => x.toHexString());
  const toAdd = ids.filter(x => !existingTrackIds.includes(x.toHexString()));
  if (toAdd.length > 0) {
    playlist.tracks.push(...toAdd);
    await playlist.save();
  }
  return toAdd.length;
  */ // Not sure whether to allow duplicates or no.
  if (ids.length > 0) {
    playlist.tracks.push(...ids);
    await playlist.save();
  }
  return ids.length;
};

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
