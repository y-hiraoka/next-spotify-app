import SpotifyWebApi from "spotify-web-api-js";
import useSWR from "swr";
import { useSpotifyClient } from "./spotify-client";

const createFetchHook = <Method extends keyof SpotifyWebApi.SpotifyWebApiJs>(
  method: Method
) => {
  return (...args: Parameters<SpotifyWebApi.SpotifyWebApiJs[Method]>) => {
    const client = useSpotifyClient();

    return useSWR<Awaited<ReturnType<SpotifyWebApi.SpotifyWebApiJs[Method]>>>(
      [client, method, ...args],
      // @ts-expect-error
      () => client[method](...args)
    );
  };
};

export const useArtist = createFetchHook("getArtist");
export const useFollowedArtists = createFetchHook("getFollowedArtists");
export const useArtistTopTracks = createFetchHook("getArtistTopTracks");
export const useMyTopArtists = createFetchHook("getMyTopArtists");
export const useMyTopTracks = createFetchHook("getMyTopTracks");
export const useFeaturedPlaylists = createFetchHook("getFeaturedPlaylists");
export const useShowEpisodes = createFetchHook("getShowEpisodes");
