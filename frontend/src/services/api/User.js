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
