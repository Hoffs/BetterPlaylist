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

trackSchema.statics.findBySpotifyId = async function findTrackBySpotifyId(...tracks) {
  const existing = await this.where('id', tracks).select('id name durationMs artist album').exec() || [];
  return existing;
};

trackSchema.statics.insertTracks = async function insertTracksIntoCollection(...tracks) {
  const uniqueIds = tracks.map(x => x.id).filter((x, pos, arr) => arr.indexOf(x) === pos);
  const existing = await this.where('id', uniqueIds).select('id').exec() || [];
  const existingIds = existing.map(x => x.get('id'));
  const remainingTracks = tracks.filter(x => !existingIds.includes(x.id));
  if (remainingTracks.length > 0) {
    await this.insertMany(remainingTracks);
  }
  return remainingTracks.length;
};

trackSchema.statics.getObjectIds = async function getObjectsIdsByTrackIds(...trackIds) {
  const existing = await this.where('id', trackIds).select('_id id').exec() || [];
  const oIds = [];
  trackIds.forEach((id) => {
    existing.forEach((track) => {
      if (track.get('id', String) === id) {
        oIds.push(track.get('_id'));
      }
    });
  }); // There has to be a better way...
  return oIds; // eslint-disable-line no-underscore-dangle
};

trackSchema.statics.getMissing = async function getMissingTracks(...trackIds) {
  const existing = await this.where('id', trackIds).select('id').exec();
  if (!existing) {
    return trackIds;
  }
  const existingIds = existing.map(x => x.get('id'));
  return trackIds.filter(x => !existingIds.includes(x));
};

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
