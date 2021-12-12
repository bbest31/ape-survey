import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const AUTH_API_URL = "https://dev-v-k6kda5.us.auth0.com";
export const SERVER_URL = "http://localhost:3001";
export const SM_API_BASE = "https://api.surveymonkey.com";

/**
 * useAccessToken is a custom React Hook used to get the current users access token.
 * @param {*} scopes
 * @returns
 */
export function useAccessToken(scopes) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async (scopes) => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: "https://dev-v-k6kda5.us.auth0.com/api/v2/",
          scope: scopes,
        });
        setToken(accessToken);
      } catch (e) {
        console.log(e);
      }
    };

    getToken(scopes);
  }, [user.sub, scopes, getAccessTokenSilently]);

  return token;
}
