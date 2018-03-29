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

export const getPlaylistTracks = async (token, playlistId, searchTerm = '') => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}/tracks`;
  let page = 1;
  const limit = 100;
  const response = await fetch(endpoint, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      Limit: limit,
      Page: page,
      Search: searchTerm,
    }),
    mode: 'cors',
  });
  if (!response.ok) {
    return null;
  }

  const tracks = [];

  const data = await response.json();
  data.forEach(track => tracks.push({
    id: track.id,
    position: track.position,
    name: track.name,
    duration: track.durationMs,
    artist: track.artist,
    album: track.album,
  }));

  const promises = [];
  while (page * response.headers.get('Limit') < response.headers.get('Total-Count')) {
    page += 1;
    const promise = fetch(endpoint, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        Limit: limit,
        Page: page,
      }),
      mode: 'cors',
    })
      .then(promiseResponse => promiseResponse.json())
      .then((promiseJson) => {
        promiseJson.forEach(track => tracks.push({
          id: track.id,
          position: track.position,
          name: track.name,
          duration: track.durationMs,
          artist: track.artist,
          album: track.album,
        }));
      });
    promises.push(promise);
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  tracks.sort((a, b) => a.position - b.position);

  return {
    id: playlistId,
    searchTerm,
    data: tracks,
  };
};

export const createPlaylist = async (token, name, description) => {
  const endpoint = `${domain}:${port}/api/playlist/`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
};

export const deletePlaylist = async (token, playlistId) => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}`;
  const response = await fetch(endpoint, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    mode: 'cors',
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
};

export const editPlaylist = async (token, playlistId, name, description) => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}`;
  const response = await fetch(endpoint, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
};

export const exportPlaylist = async (token, playlistId, name) => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}/export`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data;
};
