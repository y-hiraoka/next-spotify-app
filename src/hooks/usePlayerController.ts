import { useCallback } from "react";
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import { useMyCurrentPlaybackState } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export function usePlayerController() {
  const spotifyPlayer = useSpotifyPlayer();
  const spotifyClient = useSpotifyClient();
  const playbackState = usePlaybackState();
  const { data: myCurrentPlaybackState, mutate: mutatePlaybackState } =
    useMyCurrentPlaybackState([]);

  const playerIsActive = playbackState !== null || !!myCurrentPlaybackState;

  const isPlaying =
    (playbackState && !playbackState.paused) || !!myCurrentPlaybackState?.is_playing;

  const togglePlay = useCallback(async () => {
    if (playbackState !== null) {
      spotifyPlayer?.togglePlay();
    } else {
      await (isPlaying ? spotifyClient.pause() : spotifyClient.play());
      mutatePlaybackState((prev) =>
        prev ? { ...prev, is_playing: !prev?.is_playing } : undefined,
      );
    }
  }, [isPlaying, mutatePlaybackState, playbackState, spotifyClient, spotifyPlayer]);

  const skipToNext = useCallback(async () => {
    if (playbackState !== null) {
      spotifyPlayer?.nextTrack();
    } else {
      await spotifyClient.skipToNext();
      mutatePlaybackState();
    }
  }, [mutatePlaybackState, playbackState, spotifyClient, spotifyPlayer]);

  const skipToPrevious = useCallback(async () => {
    if (playbackState !== null) {
      spotifyPlayer?.previousTrack();
    } else {
      await spotifyClient.skipToPrevious();
      mutatePlaybackState();
    }
  }, [mutatePlaybackState, playbackState, spotifyClient, spotifyPlayer]);

  const repeatMode = playbackState
    ? REPEAT_MODES_MAP[playbackState.repeat_mode]
    : myCurrentPlaybackState?.repeat_state ?? "off";

  const changeRepeatMode = useCallback(async () => {
    const nextRepeatMode =
      repeatMode === "off" ? "context" : repeatMode === "context" ? "track" : "off";
    await spotifyClient.setRepeat(nextRepeatMode);
    mutatePlaybackState((prev) =>
      prev ? { ...prev, repeat_state: nextRepeatMode } : undefined,
    );
  }, [mutatePlaybackState, repeatMode, spotifyClient]);

  const shuffleState = playbackState?.shuffle ?? myCurrentPlaybackState?.shuffle_state;
  const toggleShuffleState = useCallback(async () => {
    await spotifyClient.setShuffle(!shuffleState);
    mutatePlaybackState((prev) =>
      prev ? { ...prev, shuffle_state: prev.shuffle_state } : undefined,
    );
  }, [mutatePlaybackState, shuffleState, spotifyClient]);

  return {
    playerIsActive,
    isPlaying,
    togglePlay,
    skipToNext,
    skipToPrevious,
    repeatMode,
    changeRepeatMode,
    shuffleState,
    toggleShuffleState,
  };
}

const REPEAT_MODES_MAP = {
  0: "off",
  1: "context",
  2: "track",
} as const;
