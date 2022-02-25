import { ReactNode, VFC } from "react";
import { usePlaybackState } from "react-spotify-web-playback-sdk";

export const WithPlaybackState: VFC<{
  render: (state: Spotify.PlaybackState | null) => ReactNode;
}> = ({ render }) => {
  const playbackState = usePlaybackState(true, 500);

  return <>{render(playbackState)}</>;
};
