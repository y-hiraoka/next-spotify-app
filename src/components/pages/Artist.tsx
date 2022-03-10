import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { memo, Suspense, useCallback, useRef, VFC } from "react";
import { useWindowSize } from "react-use";
import {
  useArtist,
  useArtistTopTracks,
  useArtistRelatedArtists,
  useArtistAlbums,
  useIsFollowingArtists,
} from "../../hooks/spotify-api";
import { useSpotifyClient } from "../../hooks/spotify-client";
import { useHeaderTransitionWithScroll } from "../../hooks/useHeaderTransitionWithScroll";
import { usePlayContextURI } from "../../hooks/usePlayContextURI";
import { pagesPath } from "../../lib/$path";
import { range } from "../../lib/range";
import { AlbumCardSkeleton, AlbumCard } from "../shared/AlbumCard";
import { ArtistCardSkeleton, ArtistCard } from "../shared/ArtistCard";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { HScrollable } from "../shared/HScrollable";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { SpotifyColorPlayButton } from "../shared/SpotifyColorPlayButton";
import { TrackSkeleton, Track } from "../shared/Track";
import { WithHeader } from "../shared/WithHeader";

export const ArtistPage: VFC<{ artistId: string }> = ({ artistId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <ArtistPageContent artistId={artistId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const ArtistPageContent: VFC<{ artistId: string }> = ({ artistId }) => {
  const { height: windowHeight } = useWindowSize();

  const spotifyClient = useSpotifyClient();
  const { data: artist } = useArtist([artistId]);
  const { data: [isFollowing] = [false], mutate: mutateIsFollowing } =
    useIsFollowingArtists([[artistId]]);

  const { isPlayingContextURI, togglePlayContextURI } = usePlayContextURI(
    artist?.uri ?? "",
  );

  const ref = useRef<HTMLDivElement>(null);
  const { headerOpacity, scrollHandler } = useHeaderTransitionWithScroll(
    ref,
    100,
    windowHeight * 0.5,
  );

  const followOfUnFollow = useCallback(async () => {
    if (isFollowing) {
      await spotifyClient.unfollowArtists([artistId]);
    } else {
      await spotifyClient.followArtists([artistId]);
    }
    mutateIsFollowing((prev) => [!prev?.[0]]);
  }, [artistId, isFollowing, mutateIsFollowing, spotifyClient]);

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
            <Heading as="h1" fontSize="md" flex={1} noOfLines={1}>
              {artist?.name}
            </Heading>
          </HStack>
        </Header>
      }>
      <Box ref={ref} position="relative" height="50%">
        <Box
          w="full"
          h="full"
          bgImage={`url(${artist?.images[0]?.url})`}
          bgColor="transparent"
          bgSize="cover"
          bgPosition="center"
        />
        <Box
          position="absolute"
          w="full"
          h="full"
          top={0}
          left={0}
          bgGradient="linear(to-b, blackAlpha.300, blackAlpha.700)"
          bgSize="cover"
        />
        <Heading
          as="h1"
          fontSize={["3xl", "4xl", "5xl", "6xl"]}
          position="absolute"
          bottom={0}
          left={0}
          p="4"
          color="white">
          {artist?.name}
        </Heading>
      </Box>
      <Stack marginTop="8" px="4" spacing="8" paddingBottom="24">
        <HStack spacing="4">
          <SpotifyColorPlayButton
            aria-label="play an artist context"
            isPlaying={isPlayingContextURI}
            onClick={togglePlayContextURI}
          />
          <Button variant="outline" colorScheme="gray" onClick={followOfUnFollow}>
            {isFollowing ? "Following" : "Follow"}
          </Button>
        </HStack>
        <Box>
          <Heading fontSize="3xl" marginBottom="2">
            Top Tracks
          </Heading>
          <Stack spacing="1">
            <Suspense fallback={<TopTracksFallback />}>
              <TopTracks artistId={artistId} />
            </Suspense>
          </Stack>
        </Box>
        <Box>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading fontSize="3xl" marginBottom="2">
              Albums
            </Heading>
            <NextLink href={pagesPath.artists._artistId(artistId).albums.$url()} passHref>
              <Link>Show more</Link>
            </NextLink>
          </Flex>
          <HScrollable>
            <HStack>
              <Suspense fallback={<AlbumsFallback />}>
                <Albums artistId={artistId} />
              </Suspense>
            </HStack>
          </HScrollable>
        </Box>
        <Box>
          <Heading fontSize="3xl" marginBottom="2">
            Related Artists
          </Heading>
          <HScrollable>
            <HStack>
              <Suspense fallback={<RelatedArtistsFallback />}>
                <RelatedArtists artistId={artistId} />
              </Suspense>
            </HStack>
          </HScrollable>
        </Box>
      </Stack>
    </WithHeader>
  );
};

const TopTracks: VFC<{ artistId: string }> = memo(({ artistId }) => {
  const { data: topTracks } = useArtistTopTracks([artistId, "jp"]);

  return (
    <>
      {topTracks?.tracks.map((track, index) => (
        <Track key={track.id} index={index} track={track} />
      ))}
    </>
  );
});

const TopTracksFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 10)].map((i) => (
        <TrackSkeleton hasThumbnail key={i} />
      ))}
    </>
  );
});

const Albums: VFC<{ artistId: string }> = memo(({ artistId }) => {
  const { data: artistAlbums } = useArtistAlbums([artistId, { limit: 10 }]);

  return (
    <>
      {artistAlbums?.items.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </>
  );
});

const AlbumsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </>
  );
});

const RelatedArtists: VFC<{ artistId: string }> = memo(({ artistId }) => {
  const { data: artistRelatedArtists } = useArtistRelatedArtists([artistId]);

  return (
    <>
      {artistRelatedArtists?.artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </>
  );
});

const RelatedArtistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
});

if (process.env.NODE_ENV === "development") {
  TopTracks.displayName = "TopTracks";
  TopTracksFallback.displayName = "TopTracksFallback";
  Albums.displayName = "Albums";
  AlbumsFallback.displayName = "AlbumsFallback";
  RelatedArtists.displayName = "RelatedArtists";
  RelatedArtistsFallback.displayName = "RelatedArtistsFallback";
}
