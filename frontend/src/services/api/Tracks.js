import { domain, port } from './conf';

export const addTracksToPlaylist = async (token, playlistId, trackArray) => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}/tracks/`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(trackArray),
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
  return { id: playlistId, data };
};

export const removeTracksFromPlaylist = async (token, playlistId, trackArray) => {
  const endpoint = `${domain}:${port}/api/playlist/${playlistId}/tracks/`;

  const promises = [];
  trackArray.forEach((element) => {
    const promise = fetch(`${endpoint}/${element}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
    });
    promises.push(promise);
  });

  await Promise.all(promises);
  return { id: playlistId };
};
