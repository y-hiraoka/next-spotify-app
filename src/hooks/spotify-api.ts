import SpotifyWebApi from "spotify-web-api-js";
import useSWR from "swr";
import { useSpotifyClient } from "./spotify-client";

const useSpotifyData = <T>(
  name: string,
  keys: unknown[],
  fetcher: (client: SpotifyWebApi.SpotifyWebApiJs) => Promise<T>
) => {
  const client = useSpotifyClient();

  return useSWR<T>([client.getAccessToken(), name, ...keys], () => fetcher(client));
};

export const useArtist = (artistId: string) => {
  return useSpotifyData("Artist", [artistId], (client) => client.getArtist(artistId));
};

type FollowedArtistsQueries = {
  type?: "artist";
  after?: string;
  limit?: number;
};
export const useFollowedArtists = (queries: FollowedArtistsQueries = {}) => {
  return useSpotifyData("FollowedArtists", [queries], (client) =>
    client.getFollowedArtists(queries)
  );
};

export const useArtistTopTracks = (artistId: string, countryId: string) => {
  return useSpotifyData("ArtistTopTracks", [artistId, countryId], (client) =>
    client.getArtistTopTracks(artistId, countryId)
  );
};

type MyTopItemsQueries = {
  limit?: number;
  offset?: number;
  time_range?: string;
};
export const useMyTopArtists = (queries: MyTopItemsQueries = {}) => {
  return useSpotifyData("MyTopArtists", [queries], (client) =>
    client.getMyTopArtists(queries)
  );
};

export const useMyTopTracks = (queries: MyTopItemsQueries = {}) => {
  return useSpotifyData("MyTopTracks", [queries], (client) =>
    client.getMyTopTracks(queries)
  );
};

type FeaturedPlaylistsQueries = {
  county?: string;
  limit?: number;
  locale?: string;
  offset?: number;
  timestamp?: string;
};
export const useFeaturedPlaylists = (queries: FeaturedPlaylistsQueries = {}) => {
  return useSpotifyData("FeaturedPlaylists", [queries], (client) =>
    client.getFeaturedPlaylists(queries)
  );
};

type ShowEpisodesQueries = {
  limit?: number;
  offset?: number;
};
export const useShowEpisodes = (showId: string, queries: ShowEpisodesQueries = {}) => {
  return useSpotifyData("ShowEpisodes", [showId, queries], (client) =>
    client.getShowEpisodes(showId, queries)
  );
};

export const useMe = () => {
  return useSpotifyData("Me", [], (client) => client.getMe());
};

type MyCurrentPlaybackStateQueries = {
  additional_types?: ("track" | "episode")[];
  market?: string;
};
export const useMyCurrentPlaybackState = (
  queries: MyCurrentPlaybackStateQueries = {}
) => {
  return useSpotifyData("MyCurrentPlaybackState", [queries], (client) =>
    client.getMyCurrentPlaybackState(queries)
  );
};

type MySavedTracksQueries = {
  limit?: number;
  market?: string;
  offset?: number;
};
export const useMySavedTracks = (queries: MySavedTracksQueries = {}) => {
  return useSpotifyData("MySavedTracks", [queries], (client) =>
    client.getMySavedTracks(queries)
  );
};

export const useContainsMySavedTracks = (trackIds: string[]) => {
  return useSpotifyData("ContainsMySavedTracks", [trackIds], (client) =>
    client.containsMySavedTracks(trackIds)
  );
};

type UserPlaylistsQueries = {
  limit?: number;
  offset?: number;
};
export const useUserPlaylists = (userId?: string, queries: UserPlaylistsQueries = {}) => {
  return useSpotifyData("UserPlaylists", [userId, queries], (client) =>
    client.getUserPlaylists(userId, queries)
  );
};

type TrackQueries = {
  market?: string;
};
export const useTrack = (trackId: string, queries: TrackQueries = {}) => {
  return useSpotifyData("Track", [trackId, queries], (client) =>
    client.getTrack(trackId, queries)
  );
};

export const useArtistRelatedArtists = (artistId: string) => {
  return useSpotifyData("ArtistRelatedArtists", [artistId], (client) =>
    client.getArtistRelatedArtists(artistId)
  );
};
