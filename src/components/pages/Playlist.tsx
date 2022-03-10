import {
  Box,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { memo, Suspense, useRef, VFC } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useWindowSize } from "react-use";
import { usePlaylist } from "../../hooks/spotify-api";
import { useHeaderTransitionWithScroll } from "../../hooks/useHeaderTransitionWithScroll";
import { useIsSavedPlaylist } from "../../hooks/useIsSavedPlaylist";
import { usePlayContextURI } from "../../hooks/usePlayContextURI";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath } from "../../lib/$path";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistTrack } from "../shared/PlaylistTrack";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { SpotifyColorPlayButton } from "../shared/SpotifyColorPlayButton";
import { WithHeader } from "../shared/WithHeader";

export const PlaylistPage: VFC<{ playlistId: string }> = ({ playlistId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <PlaylistPageContent playlistId={playlistId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const PlaylistPageContent: VFC<{ playlistId: string }> = ({ playlistId }) => {
  const { data: playlist } = usePlaylist([playlistId]);

  const { height: windowHeight } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);
  const { headerOpacity, scrollHandler } = useHeaderTransitionWithScroll(
    ref,
    100,
    windowHeight * 0.5,
  );

  const { isPlayingContextURI, togglePlayContextURI } = usePlayContextURI(
    playlist?.uri ?? "",
  );

  const { isSavedPlaylist, toggleIsSavedPlaylist } = useIsSavedPlaylist(playlistId);

  return (
    <WithHeader
      onScroll={scrollHandler}
      header={
        <Header position="relative">
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bgColor={useColorModeValue("white", "gray.800")}
            zIndex={-1}
            style={{ opacity: headerOpacity }}
          />
          <HStack
            transition="opacity 0.3s, visibility 0.3s ease"
            visibility={headerOpacity < 0.8 ? "hidden" : undefined}
            opacity={headerOpacity < 0.8 ? 0 : 1}>
            <SpotifyColorPlayButton
              aria-label="play an artist context"
              isPlaying={isPlayingContextURI}
              size="10"
              fontSize="2xl"
              onClick={togglePlayContextURI}
            />
            <Heading as="h1" fontSize="md">
              {playlist?.name}
            </Heading>
          </HStack>
        </Header>
      }>
      <Stack px="4" spacing="8" paddingBottom="24" ref={ref}>
        <Grid
          paddingTop="20"
          templateColumns={["1fr", "1fr", "auto 1fr"]}
          justifyItems="center"
          alignItems="flex-end"
          columnGap="8"
          rowGap="4">
          <Image w="64" h="64" src={playlist?.images[0].url} alt={playlist?.name} />
          <Stack w="full">
            <Heading as="h1" fontSize={["3xl", "4xl", "5xl", "6xl"]}>
              {playlist?.name}
            </Heading>
            <Flex>
              <Text as="span" mr="2">
                Owned by
              </Text>
              <NextLink href={pagesPath.users._userId(playlist?.owner.id ?? "").$url()}>
                <Link fontWeight="bold">{playlist?.owner.display_name}</Link>
              </NextLink>
            </Flex>
            <Text
              color={useSecondaryTextColor()}
              dangerouslySetInnerHTML={{ __html: playlist?.description ?? "" }}
            />
          </Stack>
        </Grid>
        <HStack spacing="4">
          <SpotifyColorPlayButton
            aria-label="play an artist context"
            isPlaying={isPlayingContextURI}
            onClick={togglePlayContextURI}
          />
          <IconButton
            aria-label="save this playlist"
            role="checkbox"
            aria-checked={isSavedPlaylist}
            icon={
              <Icon as={isSavedPlaylist ? MdFavorite : MdFavoriteBorder} fontSize="4xl" />
            }
            onClick={toggleIsSavedPlaylist}
            variant="ghost"
            size="lg"
            color={isSavedPlaylist ? "green.600" : undefined}
          />
        </HStack>
        <Stack>
          <Heading fontSize="3xl">Tracks</Heading>
          <Tracks playlistId={playlistId} />
        </Stack>
      </Stack>
    </WithHeader>
  );
};

const Tracks: VFC<{ playlistId: string }> = memo(({ playlistId }) => {
  const { data: playlist } = usePlaylist([playlistId]);

  return (
    <Stack spacing="1">
      {playlist?.tracks.items.map((track) => (
        <PlaylistTrack key={track.track.id} playlistTrack={track} />
      ))}
    </Stack>
  );
});

if (process.env.NODE_ENV === "development") {
  Tracks.displayName = "Tracks";
}
