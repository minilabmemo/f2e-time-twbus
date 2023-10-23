
import axios from 'axios';

export const fetchNewToken = async () => {
  try {
    const clientID = process.env.REACT_APP_API_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_API_CLIENT_SECRET;
    const root_url = process.env.REACT_APP_API_URL

    let url = `${root_url}/auth/realms/TDXConnect/protocol/openid-connect/token`;
    const tokenResponse = await axios.post(url, {
      grant_type: 'client_credentials',
      client_id: clientID,
      client_secret: clientSecret,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const newToken = tokenResponse.data.access_token;
    return { token: newToken, error: null };
  } catch (error) {

    return { token: null, error: error };
  }
};