var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const spotifyUtils = require('./spotifyUtils');
const uuidv4 = require('uuid/v4')
const crypto = require('crypto');

const userSchema = new Schema({
  id: String,
  spotifyId: {type: String, index: true},
  displayName: String,
  email: String,
  imageUrl: String,
  playlists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}],
  accessToken: String,
  refreshToken: String,
  tokenScope: String,
  tokenExpires: Number,
  tokenCreated: Date,
  authToken: {type: String, index: true},
  createDate: Date,
  modifyDate: Date
});

userSchema.methods.isTokenExpired = async function() {
  let created, expires_in;
  if (this.get('tokenCreated') && this.get('tokenExpires')) {
    created = this.get('tokenCreated', Date);
    expires_in = this.get('tokenExpires', Number);
  } else {
    const result = await User.findById(this.get('_id')).select('tokenCreated tokenExpires').exec();
    if (!result) {
      return null;
    }
    created = result.get('tokenCreated', Date);
    expires_in = result.get('tokenExpires', Number);
  }
  const currentDate = new Date();

  return (currentDate.getTime() - created > expires_in * 1000);
}

userSchema.methods.refreshSpotifyToken = async function() {
  let refreshToken;
  if (this.get('refreshToken')) {
    refreshToken = this.get('refreshToken');
  } else {
    const result = await User.findById(this.get('_id')).select('refreshToken').exec();
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
    tokenExpires: newTokens.expires_in,
    modifyDate: updateDate
  }).exec();
  this.set("accessToken", newTokens.token);
  this.unmarkModified('accessToken');
  return newTokens.token;
}

userSchema.statics.findByToken = async function(token) {
  const query = this.findOne({ 'authToken': token });
  const result = await query.select('id spotifyId accessToken refreshToken tokenExpires tokenCreated').exec();

  return result;
}

userSchema.statics.createOrUpdateWithCode = async function(code) {
  const tokenData = await spotifyUtils.requestTokens(code);
  if (!tokenData) return null;
  const userData = await spotifyUtils.getUserData(tokenData.token);
  if (!userData) return null;

  const query = this.findOne({ 'spotifyId': userData.spotifyId });
  const result = await query.select('id spotifyId').exec();

  if (result) {
    const updateDate = new Date();
    const newToken = crypto.createHmac('sha256', process.env.APP_SECRET)
      .update(result.get('id', String))
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
      authToken: newToken
    });
    await updateQuery.exec();
    return newToken;
  }

  const id = uuidv4();
  const createdDate = new Date();
  const token = crypto.createHmac('sha256', process.env.APP_SECRET)
    .update(id.toString())
    .update(createdDate.toISOString())
    .digest('hex');

  const created = await this.create({
    id: uuidv4(),
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
    modifyDate: createdDate
  })
  return token;
}

const trackSchema = new Schema({
  id: {type: String, index: true},
  name: String,
  durationMs: Number,
  artist: String,
  album: String,
  createDate: Date,
  modifyDate: Date
});

const playlistSchema = new Schema({
  id: {type: String, index: true},
  name: String,
  description: String,
  exportedName: String,
  exportedId: String,
  tracks: [{type: Schema.Types.ObjectId, ref: 'Track'}],
  subPlaylists: [{type: Schema.Types.ObjectId, ref: 'Playlist'}],
  createDate: Date,
  modifyDate: Date
});

const User = mongoose.model('User', userSchema);
const Track = mongoose.model('Track', trackSchema);
const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = {User, Track, Playlist};
