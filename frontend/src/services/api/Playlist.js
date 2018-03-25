import { domain, port } from './conf';

export const getPlaylistInfo = async (token, playlistId) => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}`;

  const response = await fetch(endpoint, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    mode: 'cors',
  });
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return { id: playlistId, data };
};

export const getPlaylistTracks = async (token, playlistId) => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}/tracks`;

  const response = await fetch(endpoint, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    mode: 'cors',
  });
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    id: playlistId,
    data: data.map(track => ({
      id: track.id,
      position: track.position,
      name: track.name,
      duration: track.durationMs,
      artist: track.artist,
      album: track.album,
    })),
  };
};

export const createPlaylist = async (token, name, description) => {
  //
};

export const deletePlaylist = async (token, playlistId) => {
  //
};
