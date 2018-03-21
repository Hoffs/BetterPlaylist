const mongoose = require('mongoose');
const spotifyUtils = require('../spotifyUtils');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

const Playlist = require('./playlist');

const { Schema } = mongoose;
const userSchema = new Schema({
  // id: String, use ObjectId
  spotifyId: { type: String, index: true },
  displayName: String,
  email: String,
  imageUrl: String,
  playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  accessToken: String,
  refreshToken: String,
  tokenScope: String,
  tokenExpires: Number,
  tokenCreated: Date,
  authToken: { type: String, index: true },
  createDate: Date,
  modifyDate: Date,
});

userSchema.methods.isTokenExpired = async function isSpotifyTokenExpired() {
  let created;
  let expiresIn;
  if (this.get('tokenCreated') && this.get('tokenExpires')) {
    created = this.get('tokenCreated', Date);
    expiresIn = this.get('tokenExpires', Number);
  } else {
    const result = await User.findById(this.get('_id')).select('tokenCreated tokenExpires').exec(); // eslint-disable-line no-use-before-define
    if (!result) {
      return null;
    }
    created = result.get('tokenCreated', Date);
    expiresIn = result.get('tokenExpires', Number);
  }
  const currentDate = new Date();

  return (currentDate.getTime() - created > (expiresIn - 60) * 1000); // 1 minute shorter for safety
};

userSchema.methods.refreshAccessToken = async function refreshSpotifyToken() {
  let refreshToken;
  if (this.get('refreshToken')) {
    refreshToken = this.get('refreshToken');
  } else {
    const result = await User.findById(this.get('_id')).select('refreshToken').exec(); // eslint-disable-line no-use-before-define
    if (!result) {
      return null;
    }
    refreshToken = result.get('refreshToken');
  }
  if (!refreshToken) {
    return null;
  }

  const newTokens = await spotifyUtils.refreshToken(refreshToken);
  const updateDate = new Date();
  await this.update({
    accessToken: newTokens.token,
    tokenCreated: updateDate,
    tokenExpires: newTokens.expiresIn,
    modifyDate: updateDate,
  }).exec();
  this.set('accessToken', newTokens.token);
  this.set('tokenCreated', updateDate);
  this.set('tokenExpires', newTokens.expiresIn);
  this.unmarkModified('accessToken tokenCreated tokenExpires');
  return newTokens.token;
};

userSchema.statics.findByToken = async function findUserByAuthToken(token) {
  const query = this.findOne({ authToken: token });
  const result = await query.select('spotifyId accessToken refreshToken tokenExpires tokenCreated').exec();

  return result;
};

userSchema.statics.createOrUpdateWithCode = async function createOrUpdateUserWithCode(code) {
  const tokenData = await spotifyUtils.requestTokens(code);
  if (!tokenData) return null;
  const userData = await spotifyUtils.getUserData(tokenData.token);
  if (!userData) return null;

  const query = this.findOne({ spotifyId: userData.spotifyId });
  const result = await query.select('spotifyId').exec();

  if (result) {
    const updateDate = new Date();
    const newToken = crypto.createHmac('sha256', process.env.APP_SECRET)
      .update(result.get('_id', String))
      .update(updateDate.toISOString())
      .digest('hex');
    const updateQuery = result.update({
      displayName: userData.displayName,
      email: userData.email,
      imageUrl: userData.imageUrl,
      accessToken: tokenData.token,
      refreshToken: tokenData.refresh_token,
      tokenExpires: tokenData.expires_in,
      tokenCreated: updateDate,
      modifyDate: updateDate.toISOString(),
      authToken: newToken,
    });
    await updateQuery.exec();
    return newToken;
  }

  const createdDate = new Date();
  const token = crypto.createHmac('sha256', process.env.APP_SECRET)
    .update(uuidv4().toString())
    .update(createdDate.toISOString())
    .digest('hex');

  await this.create({
    // id: uuidv4(),
    spotifyId: userData.spotifyId,
    displayName: userData.displayName,
    email: userData.email,
    imageUrl: userData.imageUrl,
    playlists: [],
    accessToken: tokenData.token,
    refreshToken: tokenData.refresh_token,
    tokenScope: tokenData.scope,
    tokenExpires: tokenData.expires_in,
    tokenCreated: createdDate,
    authToken: token,
    createDate: createdDate,
    modifyDate: createdDate,
  });
  return token;
};

userSchema.methods.addPlaylist = async function addPlaylistToUser(playlist) {
  const user = await User.findById(this.get('_id')).select('playlists').exec(); // eslint-disable-line no-use-before-define
  if (user.playlists && user.playlists.length >= 50) { // Maximum of 50 playlists per user.
    return null;
  }
  const ids = user.playlists.map(x => x.toHexString());
  if (ids.includes(playlist.get('_id').toHexString())) {
    return null;
  }
  user.playlists.push(playlist.get('_id'));
  await user.save();
  return playlist;
};

userSchema.methods.deletePlaylist = async function deleteUserPlaylist(playlistId) {
  const user = await User.findById(this.get('_id')).select('playlist').where({ playlists: playlistId }); // eslint-disable-line no-use-before-define
  if (!user) {
    return false;
  }
  await Playlist.findByIdAndRemove(playlistId).exec();
  await this.update({ $pull: { playlists: playlistId } }).exec();
  return true;
};

userSchema.methods.getPlaylists = async function getUserPlaylists(limit = 20, page = 1) {
  if (limit < 0 || page < 0) {
    return null;
  }
  const skipAmount = (page - 1) * limit;
  const user = await User.findById(this.get('_id')).select('playlists').exec(); // eslint-disable-line no-use-before-define
  const total = user.playlists.length;
  await user.populate({
    path: 'playlists',
    model: 'Playlist',
    select: 'name description exportedName exportedId subPlaylists',
    options: {
      skip: skipAmount,
      limit,
    },
  }).execPopulate();
  const data = user.playlists.map(x => ({
    id: x.get('_id'),
    name: x.name,
    description: x.description,
    exportedName: x.exportedName,
    exportedId: x.exportedId,
  }));
  return { total, data };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
