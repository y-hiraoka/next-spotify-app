import { useCallback } from "react";
import { useContainsMySavedShows, useMySavedShows } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const useIsSavedShow = (showId: string | undefined | null) => {
  const spotifyClient = useSpotifyClient();

  const { data, mutate } = useContainsMySavedShows(showId ? [[showId]] : null);
  const { mutate: mutateMySavedShows } = useMySavedShows([]);

  const isSavedShow = !!data?.[0];

  const toggleIsSavedShow = useCallback(async () => {
    if (!showId) return;

    if (isSavedShow) {
      await spotifyClient.removeFromMySavedShows([showId]);
    } else {
      await spotifyClient.addToMySavedShows([showId]);
    }

    mutate((prev) => [!prev?.[0]]);
    mutateMySavedShows();
  }, [isSavedShow, mutate, mutateMySavedShows, showId, spotifyClient]);

  return { isSavedShow, toggleIsSavedShow };
};
