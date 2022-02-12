import { useCallback, useMemo } from "react";
import { useContainsMySavedTracks,useMySavedTracks } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const useIsSavedTrack = (trackId: string | undefined | null) => {
  const spotifyClient = useSpotifyClient();

  const ids = useMemo(() => (trackId ? [trackId] : []), [trackId]);

  const { data, mutate } = useContainsMySavedTracks(ids);
  const {mutate:mutateMySavedTracks} = useMySavedTracks()

  const isSavedTrack = !!data?.[0];

  const toggleSavedTrack = useCallback(async () => {
    if (isSavedTrack) {
      await spotifyClient.removeFromMySavedTracks(ids);
    } else {
      await spotifyClient.addToMySavedTracks(ids);
    }

    mutate((prev) => [!prev?.[0]]);
    mutateMySavedTracks()
  }, [isSavedTrack, mutate, mutateMySavedTracks, spotifyClient, ids]);

  return { isSavedTrack, toggleSavedTrack };
};
