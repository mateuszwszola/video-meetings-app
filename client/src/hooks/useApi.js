import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import client from 'utils/api-client';
import { auth0Config } from 'config';

const useApi = (
  endpoint,
  {
    audience = auth0Config.audience,
    scope = auth0Config.scope,
    ...fetchOptions
  } = {}
) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const accessToken = await getAccessTokenSilently({ audience, scope });

        const data = await client(endpoint, {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setState((s) => ({
          ...s,
          data,
          error: null,
          loading: false,
        }));
      } catch (error) {
        setState((s) => ({
          ...s,
          error,
          loading: false,
        }));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export default useApi;
