import { useCallback } from "react";
import { useContainsMySavedPlaylist, useMe, useUserPlaylists } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const useIsSavedPlaylist = (playlistId: string | undefined | null) => {
  const spotifyClient = useSpotifyClient();

  const { data: me } = useMe();

  const { data, mutate } = useContainsMySavedPlaylist(
    playlistId && me?.id ? [playlistId, [me.id]] : null,
  );
  const { mutate: mutateUserPlaylists } = useUserPlaylists([]);

  const isSavedPlaylist = !!data?.[0];

  const toggleIsSavedPlaylist = useCallback(async () => {
    if (!playlistId) return;

    if (isSavedPlaylist) {
      await spotifyClient.unfollowPlaylist(playlistId);
    } else {
      await spotifyClient.followPlaylist(playlistId);
    }

    mutate((prev) => [!prev?.[0]]);
    mutateUserPlaylists();
  }, [isSavedPlaylist, mutate, mutateUserPlaylists, playlistId, spotifyClient]);

  return { isSavedPlaylist, toggleIsSavedPlaylist };
};
