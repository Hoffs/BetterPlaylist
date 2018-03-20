const { URLSearchParams } = require('url');

const fetch = require('node-fetch');

const getAppToken = () => {
  const joined = `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`;
  const b64 = Buffer.from(joined).toString('base64');
  return `Basic ${b64}`;
};

const refreshSpotifyToken = async (refreshToken) => {
  const endpoint = 'https://accounts.spotify.com/api/token';

  const params = new URLSearchParams();
  params.set('grant_type', 'refresh_token');
  params.set('refresh_token', refreshToken);
  const response = await fetch(endpoint, {
    method: 'POST',
    body: params,
    headers: {
      Authorization: getAppToken(),
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return { token: data.access_token, expiresIn: data.expires_in };
};

const requestSpotifyTokens = async (code) => {
  const endpoint = 'https://accounts.spotify.com/api/token';

  const params = new URLSearchParams();
  params.set('grant_type', 'authorization_code');
  params.set('code', code);
  params.set('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);
  const response = await fetch(endpoint, {
    method: 'POST',
    body: params,
    headers: {
      Authorization: getAppToken(),
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {
    token: data.access_token,
    scope: data.scope,
    expires_in: data.expires_in,
    refresh_token: data.refresh_token,
  };
};

const getUserSpotifyData = async (token) => {
  const endpoint = 'https://api.spotify.com/v1/me';
  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return {
    spotifyId: data.id,
    displayName: data.display_name,
    email: data.email,
    imageUrl: data.images[0].url,
  };
};

const getTrackData = async (token, ...tracks) => {
  const endpoint = 'https://api.spotify.com/v1/tracks?ids=';
  const requestUrl = `${endpoint}${tracks.join(',')}`;

  const response = await fetch(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const parsedTracks = [];
  const date = new Date();
  data.tracks.forEach((element) => {
    parsedTracks.push({
      id: element.id,
      name: element.name,
      durationMs: element.duration_ms,
      artist: element.artists.map(x => x.name).join(', '),
      album: element.album.name,
      modifyDate: date,
      createDate: date,
    });
  });
  return parsedTracks;
};

module.exports = {
  refreshToken: refreshSpotifyToken,
  requestTokens: requestSpotifyTokens,
  getUserData: getUserSpotifyData,
  getTrackData,
};
