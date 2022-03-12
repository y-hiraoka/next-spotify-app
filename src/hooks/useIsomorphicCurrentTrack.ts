import { usePlaybackState } from "react-spotify-web-playback-sdk";
import { useMyCurrentPlaybackState } from "./spotify-api";

export function useIsomorphicCurrentTrack() {
  const playbackState = usePlaybackState();
  const { data: myCurrentPlaybackState } = useMyCurrentPlaybackState([]);

  const currentTrack =
    playbackState?.track_window.current_track ?? myCurrentPlaybackState?.item;

  return currentTrack;
}
