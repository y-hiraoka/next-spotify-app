import SpotifyWebApi from "spotify-web-api-js";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { removeUndefined } from "../lib/removeUndefined";
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

type ShowEpisodesInfiniteParams = {
  showId: string;
  limit?: number;
};
export const useShowEpisodesInfinite = (params: ShowEpisodesInfiniteParams | null) => {
  const client = useSpotifyClient();

  return useSWRInfinite(
    (_, previous: SpotifyApi.ShowEpisodesResponse | null) => {
      if (previous && !previous.next) return null;
      if (params === null) return null;

      const offset = previous ? previous.limit + previous.offset : undefined;

      return [client.getAccessToken(), "ShowEpisodesInfinite", { ...params, offset }];
    },
    (_token, _name, { showId, limit, offset }) =>
      client.getShowEpisodes(showId, removeUndefined({ limit, offset }))
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

export const useSearch = (
  keys:
    | [
        query: string,
        types: ("album" | "artist" | "playlist" | "track")[],
        queries?: SpotifyApi.SearchForItemParameterObject
      ]
    | null
) => {
  return useSpotifyData("Search", keys, (client, query, types, queries) =>
    client.search(query, types, queries)
  );
};

export const useAvailableGenreSeeds = () => {
  return useSpotifyData("AvailableGenreSeeds", [], (client) =>
    client.getAvailableGenreSeeds()
  );
};

type CategoriesQueries = {
  country?: string;
  limit?: number;
  locale?: string;
  offset?: number;
};
export const useCategories = (keys: [queries?: CategoriesQueries] | null) => {
  return useSpotifyData("Categories", keys, (client, queries) =>
    client.getCategories(queries)
  );
};

type CategoryQueries = {
  country?: string;
  locale?: string;
};
export const useCategory = (
  keys: [categoryId: string, queries: CategoryQueries] | null
) => {
  return useSpotifyData("Category", keys, (client, categoryId, queries) =>
    client.getCategory(categoryId, queries)
  );
};

type CategoryPlaylistsQueries = {
  country?: string;
  limit?: number;
  offset?: number;
};
export const useCategoryPlaylists = (
  keys: [categoryId: string, queries?: CategoryPlaylistsQueries] | null
) => {
  return useSpotifyData("CategoryPlaylists", keys, (client, categoryId, queries) =>
    client.getCategoryPlaylists(categoryId, queries)
  );
};

type PlaylistQueries = {
  additional_types?: "track" | "episode";
  fields?: string;
  market?: string;
};
export const usePlaylist = (
  keys: [playlistId: string, queries?: PlaylistQueries] | null
) => {
  return useSpotifyData("Playlist", keys, (client, playlistId, queries) =>
    client.getPlaylist(playlistId, queries)
  );
};

export const useContainsMySavedPlaylist = (
  keys: [playlistId: string, userIds: string[]] | null
) => {
  return useSpotifyData("ContainsMySavedTracks", keys, (client, playlistId, userIds) =>
    client.areFollowingPlaylist(playlistId, userIds)
  );
};

type PlaylistTracksQueries = {
  additional_types?: "track" | "episode";
  fields?: string;
  market?: string;
  limit?: number;
  offset?: number;
};

export const usePlaylistTracks = (
  keys: [playlistId: string, queries?: PlaylistTracksQueries] | null
) => {
  return useSpotifyData("PlaylistTracks", keys, (client, playlistId, queries) =>
    client.getPlaylistTracks(playlistId, queries)
  );
};

export const useEpisode = (keys: [episodeId: string] | null) => {
  return useSpotifyData("Episode", keys, (client, episodeId) =>
    client.getEpisode(episodeId)
  );
};

export const useShow = (keys: [showId: string] | null) => {
  return useSpotifyData("Show", keys, (client, showId) => client.getShow(showId));
};

type MySavedShowsQueries = {
  limit?: number;
  offset?: number;
};
export const useMySavedShows = (keys: [queries?: MySavedShowsQueries] | null) => {
  return useSpotifyData("MySavedShows", keys, (client, queries) =>
    client.getMySavedShows(queries)
  );
};

export const useContainsMySavedShows = (keys: [showIds: string[]] | null) => {
  return useSpotifyData("ContainsMySavedShows", keys, (client, showIds) =>
    client.containsMySavedShows(showIds)
  );
};
