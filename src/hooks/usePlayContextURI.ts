import { useCallback } from "react";
import { useMyCurrentPlaybackState } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const usePlayContextURI = (uri: string) => {
  const spotifyClient = useSpotifyClient();
  const { data: playbackState, mutate: mutatePlayback } = useMyCurrentPlaybackState([]);

  const isPlayingContextURI =
    !!playbackState?.is_playing && playbackState.context?.uri === uri;

  const togglePlayContextURI = useCallback(async () => {
    if (isPlayingContextURI) {
      await spotifyClient.pause();
    } else if (playbackState?.context?.uri !== uri) {
      await spotifyClient.play({ context_uri: uri });
    } else {
      await spotifyClient.play();
    }
    mutatePlayback();
  }, [
    uri,
    isPlayingContextURI,
    mutatePlayback,
    playbackState?.context?.uri,
    spotifyClient,
  ]);

  return { isPlayingContextURI, togglePlayContextURI };
};
