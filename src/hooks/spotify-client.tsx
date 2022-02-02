import { Progress } from "@chakra-ui/react";
import { createContext, ReactNode, useContext, useMemo, VFC } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import useSWR from "swr";
import { AccessToken } from "../models/token";

const fetchAccessToken = async (): Promise<AccessToken> => {
  const headers = await fetch("/api/token");

  if (headers.ok) return await headers.json();
  else throw new Error("failed.");
};

const AccessTokenContext = createContext<AccessToken | undefined>(undefined);
const SpotifyClientContext = createContext<SpotifyWebApi.SpotifyWebApiJs | undefined>(
  undefined
);

export const SpotifyClientProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const { data: token, error } = useSWR("AccessToken", () => fetchAccessToken(), {
    refreshInterval: 1000 * 60 * 59,
    refreshWhenHidden: true,
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const client = useMemo(() => {
    const _client = new SpotifyWebApi();
    _client.setAccessToken(token?.access_token ?? null);
    return _client;
  }, [token?.access_token]);

  return (
    <AccessTokenContext.Provider value={token}>
      <SpotifyClientContext.Provider value={client}>
        {token === undefined && error === undefined ? (
          <Progress size="xs" isIndeterminate />
        ) : (
          children
        )}
      </SpotifyClientContext.Provider>
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => useContext(AccessTokenContext);
export const useSpotifyClient = () => {
  const client = useContext(SpotifyClientContext);
  if (client === undefined) throw new Error();
  return client;
};