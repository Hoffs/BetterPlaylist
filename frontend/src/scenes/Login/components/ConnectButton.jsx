import React from 'react';
import Button from '../../../components/Button';

const redirectUrl = 'http://localhost:3500/callback';
const spotifyUrl = `https://accounts.spotify.com/authorize/?client_id=6f954b20c1774754939fd7062ab0d89d&response_type=code&redirect_uri=${redirectUrl}&scope=user-read-private%20user-read-email%20playlist-modify-public`;

const redirectToSpotify = () => {
  window.location = spotifyUrl;
};

const ConnectButton = () => (
  <Button label="Connect" color="#1ab26b" fontSize="1.25em" clickHandler={redirectToSpotify} />
);

export default ConnectButton;
