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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { useEffect, VFC } from "react";
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
} from "react-icons/md";
import { usePlaybackState } from "react-spotify-web-playback-sdk";
import { useWindowSize } from "react-use";
import { useMyDevices } from "../../hooks/spotify-api";
import { useIsomorphicCurrentTrack } from "../../hooks/useIsomorphicCurrentTrack";
import { useIsSavedTrack } from "../../hooks/useIsSavedTrack";
import { usePlayerController } from "../../hooks/usePlayerController";
import { formatDurationMS } from "../../lib/formatDurationMS";
import { MyDevices } from "./MyDevices";
import { PlaybackSeekBar } from "./PlaybackSeekBar";
import { SecondaryText } from "./SecondaryText";
import { WithPlaybackState } from "./WithPlaybackState";

export const MobileController: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
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
      <ControllerDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

const ControllerBar: VFC = () => {
  const {
    isOpen: devicesDrawerIsOpen,
    onOpen: onOpenDevicesDrawer,
    onClose: onCloseDevicesDrawer,
  } = useDisclosure();

  const currentTrack = useIsomorphicCurrentTrack();
  const { isSavedTrack, toggleIsSavedTrack } = useIsSavedTrack(currentTrack?.id);

  const { playerIsActive, isPlaying, togglePlay } = usePlayerController();

  return (
    <>
      <Box borderRadius="md" overflow="hidden">
        <HStack
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p="2"
          boxShadow="lg"
          spacing="3">
          {currentTrack && (
            <Image
              src={currentTrack.album.images[0].url}
              alt={currentTrack.album.name}
              width="10"
              height="10"
              borderRadius="md"
            />
          )}
          <Stack spacing="0" flex={1}>
            <Text
              as="div"
              fontSize="sm"
              fontWeight="bold"
              noOfLines={1}
              wordBreak="break-all">
              {currentTrack?.name}
            </Text>
            <SecondaryText as="div" fontSize="xs" noOfLines={1} wordBreak="break-all">
              {currentTrack?.artists[0].name}
            </SecondaryText>
          </Stack>
          <HStack spacing="1.5">
            <IconButton
              aria-label="open devices drawer"
              icon={<Icon as={MdDevices} fontSize="2xl" />}
              onClick={onOpenDevicesDrawer}
              variant="ghost"
            />
            <IconButton
              role="checkbox"
              aria-label="toggle saved"
              aria-checked={isSavedTrack}
              isDisabled={!currentTrack}
              icon={
                <Icon as={isSavedTrack ? MdFavorite : MdFavoriteBorder} fontSize="3xl" />
              }
              onClick={toggleIsSavedTrack}
              variant="ghost"
              color={isSavedTrack ? "green.600" : undefined}
            />
            <IconButton
              aria-label="toggle play"
              isDisabled={!playerIsActive}
              icon={<Icon as={isPlaying ? MdPause : MdPlayArrow} fontSize="3xl" />}
              onClick={togglePlay}
              variant="ghost"
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
      <DevicesDrawer isOpen={devicesDrawerIsOpen} onClose={onCloseDevicesDrawer} />
    </>
  );
};

export const MobileControllerSkeleton: VFC = () => {
  return (
    <Box p="2" width="full">
      <Box borderRadius="md" overflow="hidden">
        <HStack
          bgColor={useColorModeValue("gray.50", "gray.900")}
          p="2"
          boxShadow="lg"
          spacing="3">
          <Skeleton width="10" height="10" borderRadius="md" />
          <Stack flex={1}>
            <SkeletonText noOfLines={1} />
            <SkeletonText noOfLines={1} />
          </Stack>
          <HStack spacing="1.5">
            <Skeleton width="10" height="10" borderRadius="md" />
            <Skeleton width="10" height="10" borderRadius="md" />
            <Skeleton width="10" height="10" borderRadius="md" />
          </HStack>
        </HStack>
      </Box>
    </Box>
  );
};

const ControllerDrawer: VFC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const playbackState = usePlaybackState();
  const currentTrack = useIsomorphicCurrentTrack();
  const { isSavedTrack, toggleIsSavedTrack } = useIsSavedTrack(currentTrack?.id);
  const { height } = useWindowSize();

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
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      size="full"
      returnFocusOnClose={false}>
      <DrawerContent maxH={height}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Text
            as="h3"
            fontSize="md"
            noOfLines={1}
            wordBreak="break-all"
            paddingRight="6">
            {playbackState?.context.metadata.context_description}
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Center h="full" maxH="full">
            <Box h="full" maxW="96" maxH="full">
              {currentTrack && (
                <Image
                  w="full"
                  h="full"
                  objectFit="contain"
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                />
              )}
            </Box>
          </Center>
        </DrawerBody>
        <DrawerFooter>
          <Stack w="full">
            <HStack>
              <Box flex={1}>
                <Heading as="h1" fontSize="2xl">
                  {currentTrack?.name}
                </Heading>
                <SecondaryText as="h2" noOfLines={1}>
                  {currentTrack?.artists[0].name}
                </SecondaryText>
              </Box>
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
            </HStack>
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
                aria-label="toggle shuffle"
                aria-checked={shuffleState ?? "mixed"}
                variant="ghost"
                color={shuffleState ? "green.600" : undefined}
                icon={<Icon fontSize="3xl" as={MdShuffle} />}
                onClick={toggleShuffleState}
              />
              <HStack>
                <IconButton
                  aria-label="skip previous"
                  borderRadius="full"
                  variant="ghost"
                  size="lg"
                  icon={<Icon fontSize="3xl" as={MdSkipPrevious} />}
                  onClick={skipToPrevious}
                />
                <IconButton
                  aria-label="toggle play"
                  borderRadius="full"
                  height="16"
                  width="16"
                  icon={<Icon fontSize="4xl" as={isPlaying ? MdPause : MdPlayArrow} />}
                  onClick={togglePlay}
                />
                <IconButton
                  aria-label="skip next"
                  borderRadius="full"
                  variant="ghost"
                  size="lg"
                  icon={<Icon fontSize="3xl" as={MdSkipNext} />}
                  onClick={skipToNext}
                />
              </HStack>
              <IconButton
                aria-label="change repeat mode"
                isDisabled={!playerIsActive}
                variant="ghost"
                size="sm"
                color={repeatMode !== "off" ? "green.600" : undefined}
                icon={
                  <Icon
                    fontSize="3xl"
                    as={repeatMode === "track" ? MdRepeatOne : MdRepeat}
                  />
                }
                onClick={changeRepeatMode}
              />
            </HStack>
          </Stack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const DevicesDrawer: VFC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { height } = useWindowSize();

  const { mutate } = useMyDevices();

  useEffect(() => {
    if (isOpen) mutate();
  }, [isOpen, mutate]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="bottom"
      size="full"
      returnFocusOnClose={false}>
      <DrawerContent maxH={height}>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading
            as="h3"
            fontSize="md"
            noOfLines={1}
            wordBreak="break-all"
            paddingRight="6">
            Connect your devices
          </Heading>
        </DrawerHeader>
        <DrawerBody>
          <MyDevices />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
