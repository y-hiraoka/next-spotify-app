import SpotifyWebApi from "spotify-web-api-js";
import useSWR from "swr";
import { useSpotifyClient } from "./spotify-client";

const useSpotifyData = <T, Keys extends unknown[]>(
  name: string,
  keys: null | Keys,
  fetcher: (client: SpotifyWebApi.SpotifyWebApiJs, ...keys: [...Keys]) => Promise<T>
) => {
  const client = useSpotifyClient();

  return useSWR<T>(
    keys !== null ? [client.getAccessToken(), name, keys] : null,
    (_token, _name, keys) => fetcher(client, ...keys),
    { suspense: true }
  );
};

export const useArtist = (keys: [artistId: string] | null) => {
  return useSpotifyData("Artist", keys, (client, artistId) => client.getArtist(artistId));
};

type FollowedArtistsQueries = {
  type?: "artist";
  after?: string;
  limit?: number;
};
export const useFollowedArtists = (keys: [queries?: FollowedArtistsQueries] | null) => {
  return useSpotifyData("FollowedArtists", keys, (client, queries) =>
    client.getFollowedArtists(queries)
  );
};

export const useArtistTopTracks = (
  keys: [artistId: string, countryId: string] | null
) => {
  return useSpotifyData("ArtistTopTracks", keys, (client, artistId, countryId) =>
    client.getArtistTopTracks(artistId, countryId)
  );
};

type MyTopItemsQueries = {
  limit?: number;
  offset?: number;
  time_range?: string;
};
export const useMyTopArtists = (keys: [queries?: MyTopItemsQueries] | null) => {
  return useSpotifyData("MyTopArtists", keys, (client, queries) =>
    client.getMyTopArtists(queries)
  );
};

export const useMyTopTracks = (keys: [queries?: MyTopItemsQueries] | null) => {
  return useSpotifyData("MyTopTracks", keys, (client, queries) =>
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
export const useFeaturedPlaylists = (
  keys: [queries?: FeaturedPlaylistsQueries] | null
) => {
  return useSpotifyData("FeaturedPlaylists", keys, (client, queries) =>
    client.getFeaturedPlaylists(queries)
  );
};

type ShowEpisodesQueries = {
  limit?: number;
  offset?: number;
};
export const useShowEpisodes = (
  keys: [showId: string, queries?: ShowEpisodesQueries] | null
) => {
  return useSpotifyData("ShowEpisodes", keys, (client, showId, queries) =>
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
  keys: [queries?: MyCurrentPlaybackStateQueries] | null
) => {
  return useSpotifyData("MyCurrentPlaybackState", keys, (client, queries) =>
    client.getMyCurrentPlaybackState(queries)
  );
};

type MySavedTracksQueries = {
  limit?: number;
  market?: string;
  offset?: number;
};
export const useMySavedTracks = (keys: [queries?: MySavedTracksQueries] | null) => {
  return useSpotifyData("MySavedTracks", keys, (client, queries) =>
    client.getMySavedTracks(queries)
  );
};

export const useContainsMySavedTracks = (keys: [trackIds: string[]] | null) => {
  return useSpotifyData("ContainsMySavedTracks", keys, (client, trackIds) =>
    client.containsMySavedTracks(trackIds)
  );
};

type UserPlaylistsQueries = {
  limit?: number;
  offset?: number;
};
export const useUserPlaylists = (
  keys: [userId?: string, queries?: UserPlaylistsQueries] | null
) => {
  return useSpotifyData("UserPlaylists", keys, (client, userId, queries) =>
    client.getUserPlaylists(userId, queries)
  );
};

type TrackQueries = {
  market?: string;
};
export const useTrack = (keys: [trackId: string, queries?: TrackQueries] | null) => {
  return useSpotifyData("Track", keys, (client, trackId, queries) =>
    client.getTrack(trackId, queries)
  );
};

export const useArtistRelatedArtists = (keys: [artistId: string] | null) => {
  return useSpotifyData("ArtistRelatedArtists", keys, (client, artistId) =>
    client.getArtistRelatedArtists(artistId)
  );
};

type ArtistAlbumsQueries = {
  include_groups?: ("album" | "single" | "appears_on" | "compilation")[];
  limit?: number;
  market?: string;
  offset?: number;
};
export const useArtistAlbums = (
  keys: [artistId: string, queries?: ArtistAlbumsQueries] | null
) => {
  return useSpotifyData("ArtistAlbums", keys, (client, artistId, queries) =>
    client.getArtistAlbums(artistId, queries)
  );
};

export const useIsFollowingArtists = (keys: [artistIds: string[]] | null) => {
  return useSpotifyData("IsFollowingArtists", keys, (client, artistIds) =>
    client.isFollowingArtists(artistIds)
  );
};

type AlbumQueries = {
  market?: string;
};

export const useAlbum = (keys: [albumId: string, queries?: AlbumQueries]) => {
  return useSpotifyData("Album", keys, (client, albumId, queries) =>
    client.getAlbum(albumId, queries)
  );
};

export const useContainsMySavedAlbums = (keys: [albumIds: string[]] | null) => {
  return useSpotifyData("ContainsMySavedAlbums", keys, (client, albumIds) =>
    client.containsMySavedAlbums(albumIds)
  );
};

type MySavedAlbumsQueries = {
  limit?: number;
  market?: string;
  offset?: number;
};
export const useMySavedAlbums = (keys: [queries?: MySavedAlbumsQueries] | null) => {
  return useSpotifyData("MySavedAlbums", keys, (client, queries) =>
    client.getMySavedAlbums(queries)
  );
};
