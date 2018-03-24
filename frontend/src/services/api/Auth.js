import { domain, port } from './conf';

const authenticateWithCode = async (code) => {
  const endpoint = `${domain}:${port}/api/auth`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const { token } = await response.json();
  return token;
};

export default { authenticateWithCode };
