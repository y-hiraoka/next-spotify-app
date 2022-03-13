import { useCallback } from "react";
import { usePlaybackState, usePlayerDevice } from "react-spotify-web-playback-sdk";
import { removeUndefined } from "../lib/removeUndefined";
import { useMyCurrentPlaybackState } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const usePlayContextURI = (uri: string) => {
  const spotifyClient = useSpotifyClient();
  const { data: myCurrentPlaybackState, mutate: mutatePlayback } =
    useMyCurrentPlaybackState([]);

  const playbackState = usePlaybackState();
  const thisDevice = usePlayerDevice();

  const playerIsActive = playbackState !== null || !!myCurrentPlaybackState;

  const isPlayingContextURI =
    !!myCurrentPlaybackState?.is_playing && myCurrentPlaybackState.context?.uri === uri;

  const togglePlayContextURI = useCallback(async () => {
    if (isPlayingContextURI) {
      await spotifyClient.pause();
    } else if (myCurrentPlaybackState?.context?.uri !== uri) {
      await spotifyClient.play(
        removeUndefined({
          device_id: playerIsActive ? undefined : thisDevice?.device_id,
          context_uri: uri,
        }),
      );
    } else {
      await spotifyClient.play();
    }
    mutatePlayback();
  }, [
    isPlayingContextURI,
    myCurrentPlaybackState?.context?.uri,
    uri,
    mutatePlayback,
    spotifyClient,
    playerIsActive,
    thisDevice?.device_id,
  ]);

  return { isPlayingContextURI, togglePlayContextURI };
};
