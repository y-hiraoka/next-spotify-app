import { Slider, SliderFilledTrack, SliderThumb, SliderTrack } from "@chakra-ui/react";
import { useCallback, useState, VFC } from "react";
import { useSpotifyPlayer } from "react-spotify-web-playback-sdk";

export const PlaybackSeekBar: VFC<{ playbackState: Spotify.PlaybackState | null }> = ({
  playbackState,
}) => {
  const spotifyPlayer = useSpotifyPlayer();

  const [isSeeking, setSeeking] = useState(false);
  const [seekingPosition, setSeekingPosition] = useState(0);

  const handleChangeStart = useCallback(() => {
    setSeeking(true);
  }, []);

  const handleChange = useCallback((value: number) => {
    setSeekingPosition(value);
  }, []);

  const handleChangeEnd = useCallback(
    (value: number) => {
      setSeeking(false);
      spotifyPlayer?.seek(value);
    },
    [spotifyPlayer],
  );

  return (
    <Slider
      aria-label="seek playback"
      size="sm"
      colorScheme="green"
      isDisabled={playbackState === null}
      value={isSeeking ? seekingPosition : playbackState?.position ?? 0}
      max={playbackState?.duration}
      focusThumbOnChange={false}
      onChangeStart={handleChangeStart}
      onChange={handleChange}
      onChangeEnd={handleChangeEnd}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
};
