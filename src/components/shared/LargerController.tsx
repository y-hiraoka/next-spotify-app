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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Heading,
} from "@chakra-ui/react";
import { useCallback, useEffect, useRef, VFC } from "react";
import {
  MdDevices,
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
import { useMyDevices } from "../../hooks/spotify-api";
import { useIsomorphicCurrentTrack } from "../../hooks/useIsomorphicCurrentTrack";
import { useIsSavedTrack } from "../../hooks/useIsSavedTrack";
import { usePlayerController } from "../../hooks/usePlayerController";
import { formatDurationMS } from "../../lib/formatDurationMS";
import { MyDevices } from "./MyDevices";
import { PlaybackSeekBar } from "./PlaybackSeekBar";
import { SecondaryText } from "./SecondaryText";
import { WithPlaybackState } from "./WithPlaybackState";

export const LargerController: VFC = () => {
  const currentTrack = useIsomorphicCurrentTrack();

  const { isSavedTrack, toggleIsSavedTrack } = useIsSavedTrack(currentTrack?.id);

  const {
    playerIsActive,
    isPlaying,
    togglePlay,
    skipToNext,
    skipToPrevious,
    repeatMode,
    changeRepeatMode,
    shuffleState,
    toggleShuffleState,
  } = usePlayerController();

  return (
    <HStack
      bgColor={useColorModeValue("gray.50", "gray.900")}
      px="4"
      py="2"
      boxShadow="lg">
      <HStack width="30%" spacing="3">
        {currentTrack && (
          <>
            <Image
              src={currentTrack.album.images[0].url}
              alt={currentTrack.album.name}
              width="12"
              height="12"
            />
            <Stack spacing="0">
              <Text
                as="div"
                fontSize="sm"
                fontWeight="bold"
                noOfLines={1}
                wordBreak="break-all">
                {currentTrack.name}
              </Text>
              <SecondaryText as="div" fontSize="xs" noOfLines={1} wordBreak="break-all">
                {currentTrack.artists[0].name}
              </SecondaryText>
            </Stack>
            <IconButton
              role="checkbox"
              aria-label="toggle saved"
              aria-checked={isSavedTrack}
              size="sm"
              icon={
                <Icon as={isSavedTrack ? MdFavorite : MdFavoriteBorder} fontSize="xl" />
              }
              onClick={toggleIsSavedTrack}
              variant="ghost"
              color={isSavedTrack ? "green.600" : undefined}
            />
          </>
        )}
      </HStack>
      <Box width="40%">
        <VStack>
          <HStack>
            <IconButton
              role="checkbox"
              aria-label="toggle shuffle"
              aria-checked={shuffleState ?? "mixed"}
              isDisabled={!playerIsActive}
              variant="ghost"
              size="sm"
              color={shuffleState ? "green.600" : undefined}
              icon={<Icon fontSize="xl" as={MdShuffle} />}
              onClick={toggleShuffleState}
            />
            <IconButton
              aria-label="skip previous"
              isDisabled={!playerIsActive}
              size="sm"
              icon={<Icon as={MdSkipPrevious} fontSize="2xl" />}
              onClick={skipToPrevious}
              variant="ghost"
            />
            <IconButton
              aria-label="toggle play"
              isDisabled={!playerIsActive}
              icon={<Icon as={isPlaying ? MdPause : MdPlayArrow} fontSize="3xl" />}
              onClick={togglePlay}
              variant="ghost"
            />
            <IconButton
              aria-label="skip next"
              isDisabled={!playerIsActive}
              size="sm"
              icon={<Icon as={MdSkipNext} fontSize="2xl" />}
              onClick={skipToNext}
              variant="ghost"
            />
            <IconButton
              aria-label="change repeat mode"
              isDisabled={!playerIsActive}
              variant="ghost"
              size="sm"
              color={repeatMode !== "off" ? "green.600" : undefined}
              icon={
                <Icon
                  fontSize="xl"
                  as={repeatMode === "track" ? MdRepeatOne : MdRepeat}
                />
              }
              onClick={changeRepeatMode}
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
        <Popover>{({ isOpen }) => <DevicesPopoverContent isOpen={isOpen} />}</Popover>
        <VolumeSeekBar />
      </HStack>
    </HStack>
  );
};

const DevicesPopoverContent: VFC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { mutate } = useMyDevices();

  useEffect(() => {
    if (isOpen) mutate();
  }, [isOpen, mutate]);

  return (
    <>
      <PopoverTrigger>
        <IconButton
          aria-label="open devices drawer"
          icon={<Icon as={MdDevices} fontSize="lg" />}
          variant="ghost"
          size="sm"
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader py="4">
          <Heading as="h3" fontSize="xl" textAlign="center">
            Connect devices
          </Heading>
        </PopoverHeader>
        <PopoverBody>
          <MyDevices />
        </PopoverBody>
      </PopoverContent>
    </>
  );
};

const VolumeSeekBar: VFC = () => {
  const spotifyPlayer = useSpotifyPlayer();
  const playbackState = usePlaybackState();

  const { data = 0, mutate } = useSWR(["PlaybackVolume", playbackState], () =>
    spotifyPlayer?.getVolume(),
  );

  const setVolume = useCallback(
    (volume: number) => {
      spotifyPlayer?.setVolume(volume);
      mutate(volume);
    },
    [mutate, spotifyPlayer],
  );

  const beforeMuteRef = useRef<number>();
  const toggleMute = useCallback(() => {
    if (beforeMuteRef.current === undefined) {
      setVolume(0);
      beforeMuteRef.current = data;
    } else {
      setVolume(beforeMuteRef.current);
      beforeMuteRef.current = undefined;
    }
  }, [data, setVolume]);

  return (
    <HStack spacing="1" minW="40">
      <IconButton
        aria-label="toggle mute"
        isDisabled={!playbackState}
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
        onClick={toggleMute}
      />
      <Slider
        aria-label="seek playback"
        isDisabled={!playbackState}
        size="sm"
        colorScheme="green"
        value={data}
        min={0}
        max={1}
        step={0.01}
        focusThumbOnChange={false}
        onChange={setVolume}>
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
      boxShadow="lg">
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
