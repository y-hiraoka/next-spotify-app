import { useCallback } from "react";
import { useContainsMySavedAlbums, useMySavedAlbums } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const useIsSavedAlbum = (albumId: string | undefined | null) => {
  const spotifyClient = useSpotifyClient();

  const { data, mutate } = useContainsMySavedAlbums(albumId ? [[albumId]] : null);
  const { mutate: mutateMySavedAlbums } = useMySavedAlbums([]);

  const isSavedAlbum = !!data?.[0];

  const toggleIsSavedAlbum = useCallback(async () => {
    if (!albumId) return;

    if (isSavedAlbum) {
      await spotifyClient.removeFromMySavedAlbums([albumId]);
    } else {
      await spotifyClient.addToMySavedAlbums([albumId]);
    }

    mutate((prev) => [!prev?.[0]]);
    mutateMySavedAlbums();
  }, [albumId, isSavedAlbum, mutate, mutateMySavedAlbums, spotifyClient]);

  return { isSavedAlbum, toggleIsSavedAlbum };
};
