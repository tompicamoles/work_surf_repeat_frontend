import { Auth0Client } from '@auth0/auth0-spa-js';

const auth0 = new Auth0Client({
  domain: 'YOUR_AUTH0_DOMAIN',
  client_id: 'YOUR_CLIENT_ID',
  redirect_uri: window.location.origin
});

// Login
const login = async () => {
  await auth0.loginWithRedirect();
};

// Get token for API calls
const getToken = async () => {
  const token = await auth0.getTokenSilently();
  return token;
};

// API call example
const fetchUserProfile = async () => {
  const token = await getToken();
  const response = await fetch('/api/users/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.json();
};