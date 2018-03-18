const URLSearchParams = require('url').URLSearchParams;

const fetch = require('node-fetch');

const getAppToken = () => {
  const joined = `${process.env.SPOTIFY_ID}:${process.env.SPOTIFY_SECRET}`;
  const b64 = Buffer.from(joined).toString('base64');
  return `Basic ${b64}`;
}

const refreshSpotifyToken = async (refresh_token) => {
  const endpoint = "https://accounts.spotify.com/api/token";

  const params = new URLSearchParams();
  params.set('grant_type', 'refresh_token');
  params.set('refresh_token', refresh_token);
  const response = await fetch(endpoint, {
    method: 'POST',
    body: params,
    headers: {
      'Authorization': getAppToken(),
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return { token: data.access_token, expires_in: data.expires_in };
}

const requestSpotifyTokens = async (code) => {
  const endpoint = "https://accounts.spotify.com/api/token";

  const params = new URLSearchParams();
  params.set('grant_type', 'authorization_code');
  params.set('code', code);
  params.set('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);
  const response = await fetch(endpoint, {
    method: 'POST',
    body: params,
    headers: {
      'Authorization': getAppToken(),
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return {token: data.access_token, scope: data.scope, expires_in: data.expires_in, refresh_token: data.refresh_token};
}

const getUserSpotifyData = async (token) => {
  const endpoint = "https://api.spotify.com/v1/me";
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return {
    spotifyId: data.id,
    displayName: data.display_name,
    email: data.email,
    imageUrl: data.images[0].url
  }
}

module.exports = {
  refreshToken: refreshSpotifyToken,
  requestTokens: requestSpotifyTokens,
  getUserData: getUserSpotifyData
};
