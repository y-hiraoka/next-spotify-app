import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  HStack,
  Icon,
  IconButton,
  Image,
  useDisclosure,
  Stack,
  Text,
  SlideFade,
  useColorModeValue,
} from "@chakra-ui/react";
import { useCallback, useMemo, VFC } from "react";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdPause,
  MdPlayArrow,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import {
  useContainsMySavedTracks,
  useMyCurrentPlaybackState,
  useMySavedTracks,
} from "../hooks/spotify-api";
import { useSpotifyClient } from "../hooks/spotify-client";

export const PlayerController: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const playbackstate = usePlaybackState();

  return (
    <>
      <SlideFade in={!!playbackstate}>
        <Box p="2" width="full" position="relative">
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            onClick={onOpen}
            role="button"
          />
          {playbackstate && <PlayerControllerBar playbackState={playbackstate} />}
        </Box>
      </SlideFade>
      <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Now Playing</DrawerHeader>
          <HStack>
            <IconButton
              aria-label="skip previous"
              color="whiteAlpha.800"
              borderRadius="full"
              variant="ghost"
              icon={<Icon fontSize="2xl" as={MdSkipPrevious} />}
            />
            <IconButton
              aria-label="skip previous"
              color="whiteAlpha.800"
              borderRadius="full"
              variant="ghost"
              icon={<Icon fontSize="2xl" as={MdSkipPrevious} />}
            />
            <IconButton
              color="black"
              bgColor="gray.100"
              aria-label="play"
              borderRadius="full"
              icon={<Icon fontSize="2xl" as={MdPlayArrow} />}
            />
            <IconButton
              aria-label="skip next"
              color="whiteAlpha.800"
              borderRadius="full"
              variant="ghost"
              icon={<Icon fontSize="2xl" as={MdSkipNext} />}
            />
            <IconButton
              aria-label="skip previous"
              color="whiteAlpha.800"
              borderRadius="full"
              variant="ghost"
              icon={<Icon fontSize="2xl" as={MdSkipPrevious} />}
            />
          </HStack>
        </DrawerContent>
      </Drawer>
    </>
  );
};

const PlayerControllerBar: VFC<{ playbackState: Spotify.PlaybackState }> = ({
  playbackState,
}) => {
  const currentTrack = playbackState.track_window.current_track;

  const spotifyClient = useSpotifyClient();
  const spotifyPlayer = useSpotifyPlayer();

  const currentPlayingIds = useMemo(
    () => (currentTrack.id ? [currentTrack.id] : []),
    [currentTrack.id]
  );

  const { data: ContainsMySavedTracksData, mutate: mutateContainsMySavedTracks } =
    useContainsMySavedTracks(currentPlayingIds);

  const isSavedTrack = !!ContainsMySavedTracksData?.[0];

  const toggleSavedTrack = useCallback(async () => {
    if (isSavedTrack) {
      await spotifyClient.removeFromMySavedTracks(currentPlayingIds);
    } else {
      await spotifyClient.addToMySavedTracks(currentPlayingIds);
    }
    mutateContainsMySavedTracks((prev) => [!prev?.[0]]);
  }, [isSavedTrack, mutateContainsMySavedTracks, spotifyClient, currentPlayingIds]);

  return (
    <HStack
      bgColor={useColorModeValue("gray.50", "gray.900")}
      borderRadius="md"
      p="2"
      boxShadow="lg"
      spacing="3"
    >
      <Image
        src={currentTrack.album.images[0].url}
        alt={currentTrack.album.name}
        width="10"
        height="10"
        borderRadius="md"
      />
      <Stack spacing="0" flex={1}>
        <Text
          as="div"
          fontSize="sm"
          fontWeight="bold"
          noOfLines={1}
          wordBreak="break-all"
        >
          {currentTrack.name}
        </Text>
        <Text
          as="div"
          fontSize="xs"
          noOfLines={1}
          wordBreak="break-all"
          color={useColorModeValue("gray.500", "whiteAlpha.800")}
        >
          {currentTrack.artists[0].name}
        </Text>
      </Stack>
      <HStack>
        <IconButton
          aria-label="like button"
          icon={<Icon as={isSavedTrack ? MdFavorite : MdFavoriteBorder} fontSize="2xl" />}
          onClick={toggleSavedTrack}
          variant="ghost"
          // color="gray.100"
        />
        <IconButton
          aria-label="like button"
          icon={
            <Icon as={playbackState?.paused ? MdPlayArrow : MdPause} fontSize="2xl" />
          }
          onClick={spotifyPlayer?.togglePlay}
          variant="ghost"
          // color="gray.100"
        />
      </HStack>
    </HStack>
  );
};
