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
import { useArtistAlbums, useAlbum } from "../../hooks/spotify-api";
import { useHeaderTransitionWithScroll } from "../../hooks/useHeaderTransitionWithScroll";
import { useIsSavedAlbum } from "../../hooks/useIsSavedAlbum";
import { usePlayContextURI } from "../../hooks/usePlayContextURI";
import { pagesPath } from "../../lib/$path";
import { range } from "../../lib/range";
import { AlbumCardSkeleton, AlbumCard } from "../shared/AlbumCard";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { SpotifyColorPlayButton } from "../shared/SpotifyColorPlayButton";
import { Track } from "../shared/Track";
import { WithHeader } from "../shared/WithHeader";

export const AlbumPage: VFC<{ albumId: string }> = ({ albumId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <AlbumPageContent albumId={albumId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const AlbumPageContent: VFC<{ albumId: string }> = ({ albumId }) => {
  const { data: album } = useAlbum([albumId]);

  const artistId = album?.artists[0].id ?? "";

  const { height: windowHeight } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);
  const { headerOpacity, scrollHandler } = useHeaderTransitionWithScroll(
    ref,
    100,
    windowHeight * 0.5,
  );

  const { isPlayingContextURI, togglePlayContextURI } = usePlayContextURI(
    album?.uri ?? "",
  );

  const { isSavedAlbum, toggleIsSavedAlbum } = useIsSavedAlbum(albumId);

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
              {album?.name}
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
          <Image w="64" h="64" src={album?.images[0].url} alt={album?.name} />
          <Box w="full">
            <Text as="span">{album?.album_type}</Text>
            <Heading as="h1" fontSize={["3xl", "4xl", "5xl", "6xl"]}>
              {album?.name}
            </Heading>
            <Flex marginTop="4">
              <Text as="div" fontWeight="bold">
                <NextLink href={pagesPath.artists._artistId(artistId).$url()}>
                  <Link>{album?.artists[0].name}</Link>
                </NextLink>
              </Text>
            </Flex>
          </Box>
        </Grid>
        <HStack spacing="4">
          <SpotifyColorPlayButton
            aria-label="play an artist context"
            isPlaying={isPlayingContextURI}
            onClick={togglePlayContextURI}
          />
          <IconButton
            aria-label="save this album"
            role="checkbox"
            aria-checked={isSavedAlbum}
            icon={
              <Icon as={isSavedAlbum ? MdFavorite : MdFavoriteBorder} fontSize="4xl" />
            }
            onClick={toggleIsSavedAlbum}
            variant="ghost"
            size="lg"
            color={isSavedAlbum ? "green.600" : undefined}
          />
        </HStack>
        <Stack>
          <Heading fontSize="3xl">Tracks</Heading>
          <Stack>
            {album?.tracks.items.map((track, index) => (
              <Track key={track.id} index={index} track={track} />
            ))}
          </Stack>
        </Stack>
        <Stack>
          <Heading
            fontSize="3xl"
            title={`${album?.artists[0].name}'s other albums`}
            noOfLines={1}>
            {album?.artists[0].name}&apos;s other albums
          </Heading>
          <Flex w="full" overflowX="auto" gap="4">
            <Suspense fallback={<OtherAlbumsFallback />}>
              <OtherAlbums artistId={artistId} />
            </Suspense>
          </Flex>
        </Stack>
      </Stack>
    </WithHeader>
  );
};

const OtherAlbums: VFC<{ artistId: string }> = memo(({ artistId }) => {
  const { data: artistAlbums } = useArtistAlbums([artistId]);

  return (
    <>
      {artistAlbums?.items.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </>
  );
});

const OtherAlbumsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </>
  );
});

if (process.env.NODE_ENV === "development") {
  OtherAlbums.displayName = "RelatedArtists";
  OtherAlbumsFallback.displayName = "RelatedArtistsFallback";
}
