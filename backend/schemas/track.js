const mongoose = require('mongoose');

const { Schema } = mongoose;

const trackSchema = new Schema({
  id: { type: String, index: true },
  name: String,
  durationMs: Number,
  artist: String,
  album: String,
  createDate: Date,
  modifyDate: Date,
});

trackSchema.statics.insertTracks = async function insertTracksIntoCollection(tracks) {
  const ids = tracks.map(x => x.id).filter((x, pos, arr) => arr.indexOf(x) === pos);
  const existing = await this.where('id', ids).select('id').exec() || [];
  const existingIds = existing.map(x => x.get('id'));
  const remainingTracks = tracks.filter(x => !existingIds.includes(x.id));
  if (remainingTracks.length > 0) {
    await this.insertMany(remainingTracks);
  }
  return remainingTracks.length;
};

trackSchema.statics.getObjectIds = async function getObjectsIdsByTrackIds(tracks) {
  const ids = tracks.map(x => x.id);
  const existing = await this.where('id', ids).select('_id').exec() || [];
  return existing.map(x => x.get('_id')); // eslint-disable-line no-underscore-dangle
};


const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
