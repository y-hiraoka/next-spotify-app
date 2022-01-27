import { useMemo } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import useSWR from "swr";
import { useAccessToken } from "./token";

const useSpotifyClient = () => {
  const accessToken = useAccessToken();

  const spotifyClient = useMemo(() => {
    const client = new SpotifyWebApi();
    client.setAccessToken(accessToken?.access_token ?? null);
    return client;
  }, [accessToken?.access_token]);

  return spotifyClient;
};

const createFetchHook = <Method extends keyof SpotifyWebApi.SpotifyWebApiJs>(
  method: Method
) => {
  return (...args: Parameters<SpotifyWebApi.SpotifyWebApiJs[Method]>) => {
    const client = useSpotifyClient();

    return useSWR<Awaited<ReturnType<SpotifyWebApi.SpotifyWebApiJs[Method]>>>(
      [client, ...args],
      // @ts-expect-error
      () => client[method](...args)
    );
  };
};

export const useArtist = createFetchHook("getArtist");
export const useFollowedArtists = createFetchHook("getFollowedArtists");
