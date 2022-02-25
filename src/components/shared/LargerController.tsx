import {
  Box,
  HStack,
  Icon,
  IconButton,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useCallback, useRef, VFC } from "react";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdPause,
  MdPlayArrow,
  MdRepeat,
  MdRepeatOne,
  MdShuffle,
  MdSkipNext,
  MdSkipPrevious,
  MdVolumeDown,
  MdVolumeMute,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import useSWR from "swr";
import { useMyCurrentPlaybackState } from "../../hooks/spotify-api";
import { useSpotifyClient } from "../../hooks/spotify-client";
import { useIsSavedTrack } from "../../hooks/useSavedTrack";
import { formatDurationMS } from "../../lib/formatDurationMS";
import { PlaybackSeekBar } from "./PlaybackSeekBar";
import { WithPlaybackState } from "./WithPlaybackState";

export const LargerController: VFC = () => {
  const spotifyPlayer = useSpotifyPlayer();
  const spotifyClient = useSpotifyClient();
  const playbackState = usePlaybackState();
  const myCurrentPlaybackState = useMyCurrentPlaybackState([]);
  const currentTrack =
    playbackState?.track_window.current_track ?? myCurrentPlaybackState.data?.item;

  const { isSavedTrack, toggleSavedTrack } = useIsSavedTrack(currentTrack?.id);

  const shuffleState =
    myCurrentPlaybackState.data?.shuffle_state ?? playbackState?.shuffle;

  return (
    <HStack
      bgColor={useColorModeValue("gray.50", "gray.900")}
      px="4"
      py="2"
      boxShadow="lg"
    >
      <HStack width="30%" spacing="3">
        <Image
          src={currentTrack?.album.images[0].url}
          alt={currentTrack?.album.name}
          width="12"
          height="12"
        />
        <Stack spacing="0">
          <Text
            as="div"
            fontSize="sm"
            fontWeight="bold"
            noOfLines={1}
            wordBreak="break-all"
          >
            {currentTrack?.name}
          </Text>
          <Text
            as="div"
            fontSize="xs"
            noOfLines={1}
            wordBreak="break-all"
            color={useColorModeValue("gray.500", "whiteAlpha.800")}
          >
            {currentTrack?.artists[0].name}
          </Text>
        </Stack>
        <IconButton
          role="checkbox"
          aria-label="toggle saved"
          aria-checked={isSavedTrack}
          size="sm"
          icon={<Icon as={isSavedTrack ? MdFavorite : MdFavoriteBorder} fontSize="xl" />}
          onClick={toggleSavedTrack}
          variant="ghost"
          color={isSavedTrack ? "green.600" : undefined}
        />
      </HStack>
      <Box width="40%">
        <VStack>
          <HStack>
            <IconButton
              role="checkbox"
              aria-label="toggle shuffle"
              aria-checked={shuffleState ?? "mixed"}
              variant="ghost"
              size="sm"
              color={shuffleState ? "green.600" : undefined}
              icon={<Icon fontSize="xl" as={MdShuffle} />}
              onClick={() => spotifyClient.setShuffle(!shuffleState)}
            />
            <IconButton
              aria-label="skip previous"
              size="sm"
              icon={<Icon as={MdSkipPrevious} fontSize="2xl" />}
              onClick={() => spotifyPlayer?.previousTrack()}
              variant="ghost"
            />
            <IconButton
              aria-label="toggle play"
              icon={
                <Icon as={playbackState?.paused ? MdPlayArrow : MdPause} fontSize="3xl" />
              }
              onClick={() => spotifyPlayer?.togglePlay()}
              variant="ghost"
            />
            <IconButton
              aria-label="skip next"
              size="sm"
              icon={<Icon as={MdSkipNext} fontSize="2xl" />}
              onClick={() => spotifyPlayer?.nextTrack()}
              variant="ghost"
            />
            <IconButton
              role=""
              aria-label="toggle shuffle"
              aria-checked={playbackState?.shuffle ?? "mixed"}
              variant="ghost"
              size="sm"
              color={
                playbackState?.repeat_mode !== REPEAT_MODES.off ? "green.600" : undefined
              }
              icon={
                <Icon
                  fontSize="xl"
                  as={
                    playbackState?.repeat_mode === REPEAT_MODES.track
                      ? MdRepeatOne
                      : MdRepeat
                  }
                />
              }
              onClick={() =>
                spotifyClient.setRepeat(
                  getNextRepeatMode(playbackState?.repeat_mode ?? 0)
                )
              }
            />
          </HStack>
          <WithPlaybackState
            render={(state) => (
              <HStack w="full">
                <Text as="span" fontSize="xs">
                  {formatDurationMS(state?.position ?? 0)}
                </Text>
                <PlaybackSeekBar playbackState={state} />
                <Text as="span" fontSize="xs">
                  {formatDurationMS(state?.duration ?? 0)}
                </Text>
              </HStack>
            )}
          />
        </VStack>
      </Box>
      <HStack width="30%" justifyContent="flex-end">
        <VolumeSeekBar />
      </HStack>
    </HStack>
  );
};

const REPEAT_MODES = {
  off: 0,
  context: 1,
  track: 2,
} as const;

const REPEAT_MODES_STRING = {
  0: "off",
  1: "context",
  2: "track",
} as const;

const getNextRepeatMode = (
  currentMode: Spotify.PlaybackState["repeat_mode"]
): SpotifyApi.PlaybackRepeatState => {
  const next = ((currentMode + 1) % 3) as Spotify.PlaybackState["repeat_mode"];
  return REPEAT_MODES_STRING[next];
};

const VolumeSeekBar: VFC = () => {
  const spotifyPlayer = useSpotifyPlayer();
  const playbackState = usePlaybackState();
  const { data = 0.5, mutate } = useSWR([playbackState], () =>
    spotifyPlayer?.getVolume()
  );

  const setVolume = useCallback(
    (volume: number) => {
      spotifyPlayer?.setVolume(volume);
      mutate(volume);
    },
    [mutate, spotifyPlayer]
  );

  const beforeMuteRef = useRef<number>();

  return (
    <HStack spacing="1" minW="40">
      <IconButton
        aria-label="toggle mute"
        size="sm"
        variant="ghost"
        icon={
          <Icon
            fontSize="lg"
            as={
              !data
                ? MdVolumeOff
                : data < 0.33
                ? MdVolumeMute
                : data < 0.66
                ? MdVolumeDown
                : MdVolumeUp
            }
          />
        }
        onClick={() => {
          if (beforeMuteRef.current === undefined) {
            setVolume(0);
            beforeMuteRef.current = data;
          } else {
            setVolume(beforeMuteRef.current);
            beforeMuteRef.current = undefined;
          }
        }}
      />
      <Slider
        aria-label="seek playback"
        size="sm"
        colorScheme="green"
        value={data}
        min={0}
        max={1}
        step={0.01}
        focusThumbOnChange={false}
        onChange={setVolume}
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb w="2" h="2" />
      </Slider>
    </HStack>
  );
};

export const LargerControllerSkeleton: VFC = () => {
  return (
    <HStack
      bgColor={useColorModeValue("gray.50", "gray.900")}
      px="4"
      py="2"
      boxShadow="lg"
    >
      <HStack width="30%" spacing="3">
        <Skeleton width="12" height="12" />
        <Stack flex="0.6">
          <SkeletonText noOfLines={1} />
          <SkeletonText noOfLines={1} />
        </Stack>
      </HStack>
      <Box width="40%">
        <VStack>
          <HStack>
            <Skeleton w="10" h="10" />
            <Skeleton w="10" h="10" />
            <Skeleton w="10" h="10" />
            <Skeleton w="10" h="10" />
            <Skeleton w="10" h="10" />
          </HStack>
          <HStack w="full">
            <SkeletonText fontSize="xs" noOfLines={1} h="4">
              00:00
            </SkeletonText>
            <Skeleton flex={1} h="1" />
            <SkeletonText fontSize="xs" noOfLines={1} h="4">
              00:00
            </SkeletonText>
          </HStack>
        </VStack>
      </Box>
      <HStack width="30%" justifyContent="flex-end">
        <Skeleton w="40" h="2" />
      </HStack>
    </HStack>
  );
};
