import auth from './Auth';
import { getUserInfo, getPlaylists } from './User';
import { getPlaylistInfo, getPlaylistTracks } from './Playlist';
import { addTracksToPlaylist, removeTracksFromPlaylist } from './Tracks';

export default {
  authenticate: auth.authenticateWithCode,
  userInfo: getUserInfo,
  playlists: getPlaylists,
  playlistInfo: getPlaylistInfo,
  playlistTracks: getPlaylistTracks,
  addTracks: addTracksToPlaylist,
  removeTracks: removeTracksFromPlaylist,
};
