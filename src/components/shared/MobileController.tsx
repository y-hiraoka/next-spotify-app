import {
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  HStack,
  Icon,
  IconButton,
  Image,
  useDisclosure,
  Stack,
  Text,
  useColorModeValue,
  Progress,
  Center,
  Heading,
} from "@chakra-ui/react";
import { VFC } from "react";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdPause,
  MdPlayArrow,
  MdShuffle,
  MdSkipNext,
  MdSkipPrevious,
} from "react-icons/md";
import { usePlaybackState, useSpotifyPlayer } from "react-spotify-web-playback-sdk";
import { useWindowSize } from "react-use";
import { useSpotifyClient } from "../../hooks/spotify-client";
import { useIsSavedTrack } from "../../hooks/useIsSavedTrack";
import { formatDurationMS } from "../../lib/formatDurationMS";
import { PlaybackSeekBar } from "./PlaybackSeekBar";
import { WithPlaybackState } from "./WithPlaybackState";

export const MobileController: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const playbackState = usePlaybackState();

  return (
    playbackState && (
      <>
        <Box p="2" width="full" position="relative">
          <Box
            as="button"
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            onClick={onOpen}
          />
          <ControllerBar />
        </Box>
        <ControllerDrawer
          isOpen={isOpen}
          onClose={onClose}
          playbackState={playbackState}
        />
      </>
    )
  );
};

const ControllerBar: VFC = () => {
  const playbackState = usePlaybackState();
  const currentTrack = playbackState?.track_window.current_track;

  const spotifyPlayer = useSpotifyPlayer();

  const { isSavedTrack, toggleIsSavedTrack } = useIsSavedTrack(currentTrack?.id);

  return (
    <Box borderRadius="md" overflow="hidden">
      <HStack
        bgColor={useColorModeValue("gray.50", "gray.900")}
        p="2"
        boxShadow="lg"
        spacing="3"
      >
        <Image
          src={currentTrack?.album.images[0].url}
          alt={currentTrack?.album.name}
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
        <HStack>
          <IconButton
            role="checkbox"
            aria-label="toggle saved"
            aria-checked={isSavedTrack}
            icon={
              <Icon as={isSavedTrack ? MdFavorite : MdFavoriteBorder} fontSize="3xl" />
            }
            onClick={toggleIsSavedTrack}
            variant="ghost"
            color={isSavedTrack ? "green.600" : undefined}
          />
          <IconButton
            aria-label="toggle play"
            icon={
              <Icon as={playbackState?.paused ? MdPlayArrow : MdPause} fontSize="3xl" />
            }
            onClick={() => spotifyPlayer?.togglePlay()}
            variant="ghost"
            // color="gray.100"
          />
        </HStack>
      </HStack>
      <WithPlaybackState
        render={(playbackState) => (
          <Progress
            value={playbackState?.position}
            max={playbackState?.duration}
            h="2px"
            colorScheme="green"
          />
        )}
      />
    </Box>
  );
};

const ControllerDrawer: VFC<{
  isOpen: boolean;
  onClose: () => void;
  playbackState: Spotify.PlaybackState;
}> = ({ isOpen, onClose, playbackState }) => {
  const currentTrack = playbackState.track_window.current_track;
  const spotifyPlayer = useSpotifyPlayer();
  const spotifyClient = useSpotifyClient();
  const { isSavedTrack, toggleIsSavedTrack } = useIsSavedTrack(currentTrack?.id);
  const { height } = useWindowSize();

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom" size="full">
      <DrawerContent maxH={height}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Text
            as="h3"
            fontSize="md"
            noOfLines={1}
            wordBreak="break-all"
            paddingRight="6"
          >
            {currentTrack.artists[0].name}
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Center h="full" maxH="full">
            <Box h="full" maxW="96" maxH="full">
              <Image
                w="full"
                h="full"
                objectFit="contain"
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album.name}
              />
            </Box>
          </Center>
        </DrawerBody>
        <DrawerFooter>
          <Stack w="full">
            <Heading as="h1" fontSize="2xl">
              {currentTrack.name}
            </Heading>
            <Heading as="h2" noOfLines={1} fontSize="lg">
              {currentTrack.artists[0].name}
            </Heading>
            <WithPlaybackState
              render={(state) => (
                <Box width="full">
                  <PlaybackSeekBar playbackState={state} />
                  <HStack justifyContent="space-between" mt="-1">
                    <Text as="span" fontSize="xs">
                      {formatDurationMS(state?.position ?? 0)}
                    </Text>
                    <Text as="span" fontSize="xs">
                      {formatDurationMS(state?.duration ?? 0)}
                    </Text>
                  </HStack>
                </Box>
              )}
            />
            <HStack justifyContent="space-between" w="full">
              <IconButton
                role="checkbox"
                aria-label="toggle saved"
                aria-checked={isSavedTrack}
                icon={
                  <Icon
                    as={isSavedTrack ? MdFavorite : MdFavoriteBorder}
                    fontSize="3xl"
                  />
                }
                color={isSavedTrack ? "green.600" : undefined}
                onClick={toggleIsSavedTrack}
                variant="ghost"
              />
              <HStack>
                <IconButton
                  aria-label="skip previous"
                  borderRadius="full"
                  variant="ghost"
                  size="lg"
                  icon={<Icon fontSize="3xl" as={MdSkipPrevious} />}
                  onClick={() => spotifyPlayer?.previousTrack()}
                />
                <IconButton
                  aria-label="toggle play"
                  borderRadius="full"
                  height="16"
                  width="16"
                  icon={
                    <Icon
                      fontSize="4xl"
                      as={playbackState.paused ? MdPlayArrow : MdPause}
                    />
                  }
                  onClick={() => spotifyPlayer?.togglePlay()}
                />
                <IconButton
                  aria-label="skip next"
                  borderRadius="full"
                  variant="ghost"
                  size="lg"
                  icon={<Icon fontSize="3xl" as={MdSkipNext} />}
                  onClick={() => spotifyPlayer?.nextTrack()}
                />
              </HStack>
              <IconButton
                role="checkbox"
                aria-label="toggle shuffle"
                aria-checked={playbackState.shuffle}
                variant="ghost"
                color={playbackState.shuffle ? "green.600" : undefined}
                icon={<Icon fontSize="3xl" as={MdShuffle} />}
                onClick={() => spotifyClient.setShuffle(!playbackState.shuffle)}
              />
            </HStack>
          </Stack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
