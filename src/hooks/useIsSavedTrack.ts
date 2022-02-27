import { useCallback } from "react";
import { useContainsMySavedTracks, useMySavedTracks } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const useIsSavedTrack = (trackId: string | undefined | null) => {
  const spotifyClient = useSpotifyClient();

  const { data, mutate } = useContainsMySavedTracks(trackId ? [[trackId]] : null);
  const { mutate: mutateMySavedTracks } = useMySavedTracks([]);

  const isSavedTrack = !!data?.[0];

  const toggleIsSavedTrack = useCallback(async () => {
    if (!trackId) return;

    if (isSavedTrack) {
      await spotifyClient.removeFromMySavedTracks([trackId]);
    } else {
      await spotifyClient.addToMySavedTracks([trackId]);
    }

    mutate((prev) => [!prev?.[0]]);
    mutateMySavedTracks();
  }, [trackId, isSavedTrack, mutate, mutateMySavedTracks, spotifyClient]);

  return { isSavedTrack, toggleIsSavedTrack };
};
