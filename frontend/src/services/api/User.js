import { domain, port } from './conf';

export const getUserInfo = async (token) => {
  const endpoint = `${domain}:${port}/api/user`;

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
  return data;
};

export const getPlaylists = async (token) => {
  const endpoint = `${domain}:${port}/api/playlist`;
  let page = 1;
  const limit = 50;
  const response = await fetch(endpoint, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      Limit: limit,
      Page: page,
    }),
    mode: 'cors',
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();

  const playlists = [];
  playlists.push(...data);
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
      .then(promiseJson => playlists.push(...promiseJson));
    promises.push(promise);
  }

  if (promises.length > 0) {
    await Promise.all(promises);
  }

  return playlists;
};
