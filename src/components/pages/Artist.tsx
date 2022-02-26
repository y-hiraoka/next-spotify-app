import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Suspense, useCallback, useRef, useState, VFC } from "react";
import { useWindowSize } from "react-use";
import {
  useMyCurrentPlaybackState,
  useArtist,
  useArtistTopTracks,
  useArtistRelatedArtists,
  useArtistAlbums,
  useIsFollowingArtists,
} from "../../hooks/spotify-api";
import { useSpotifyClient } from "../../hooks/spotify-client";
import { range } from "../../lib/range";
import { AlbumCardSkeleton, AlbumCard } from "../shared/AlbumCard";
import { ArtistCardSkeleton, ArtistCard } from "../shared/ArtistCard";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
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
  const { data: playbackState, mutate: mutatePlayback } = useMyCurrentPlaybackState([]);
  const { data: artist } = useArtist([artistId]);
  const { data: [isFollowing] = [false], mutate: mutateIsFollowing } =
    useIsFollowingArtists([[artistId]]);

  const isPlayingThisArtist =
    !!playbackState?.is_playing && playbackState.context?.uri === artist?.uri;

  const ref = useRef<HTMLDivElement>(null);

  const [headerBgOpacity, setHeaderBgOpacity] = useState(0);

  const scrollHandler = useCallback(() => {
    const transitionStart = 100;
    const transitionEnd = windowHeight * 0.5;

    const top = Math.abs(ref.current?.getBoundingClientRect().top ?? 0);
    const calculatedOpacity = [
      0,
      (top - transitionStart) / (transitionEnd - transitionStart),
      1,
    ].sort()[1];
    setHeaderBgOpacity(calculatedOpacity);
  }, [windowHeight]);

  const followOfUnFollow = useCallback(async () => {
    if (isFollowing) {
      await spotifyClient.unfollowArtists([artistId]);
    } else {
      await spotifyClient.followArtists([artistId]);
    }
    mutateIsFollowing((prev) => [!prev?.[0]]);
  }, [artistId, isFollowing, mutateIsFollowing, spotifyClient]);

  const togglePlayThisArtist = useCallback(async () => {
    if (isPlayingThisArtist) {
      await spotifyClient.pause();
    } else if (playbackState?.context?.uri !== artist?.uri) {
      await spotifyClient.play({ context_uri: artist?.uri });
    } else {
      await spotifyClient.play();
    }
    mutatePlayback();
  }, [
    artist?.uri,
    isPlayingThisArtist,
    mutatePlayback,
    playbackState?.context?.uri,
    spotifyClient,
  ]);

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
            style={{ opacity: headerBgOpacity }}
          />
          <HStack
            transition="opacity 0.3s, visibility 0.3s ease"
            visibility={headerBgOpacity < 0.8 ? "hidden" : undefined}
            opacity={headerBgOpacity < 0.8 ? 0 : 1}
          >
            <SpotifyColorPlayButton
              aria-label="play an artist context"
              isPlaying={isPlayingThisArtist}
              size="10"
              fontSize="2xl"
              onClick={togglePlayThisArtist}
            />
            <Heading as="h1" fontSize="md" flex={1} noOfLines={1}>
              {artist?.name}
            </Heading>
          </HStack>
        </Header>
      }
    >
      <Box ref={ref} position="relative" height="60%">
        <Box
          w="full"
          h="full"
          bgImage={`url(${artist?.images[0].url})`}
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
          color="white"
        >
          {artist?.name}
        </Heading>
      </Box>
      <Stack marginTop="8" px="4" spacing="8">
        <HStack spacing="4">
          <SpotifyColorPlayButton
            aria-label="play an artist context"
            isPlaying={isPlayingThisArtist}
            onClick={togglePlayThisArtist}
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
          <Heading fontSize="3xl" marginBottom="2">
            Albums
          </Heading>
          <Flex w="full" overflowX="auto" gap="4">
            <Suspense fallback={<AlbumsFallback />}>
              <Albums artistId={artistId} />
            </Suspense>
          </Flex>
        </Box>
        <Box>
          <Heading fontSize="3xl" marginBottom="2">
            Related Artists
          </Heading>
          <Flex w="full" overflowX="auto" gap="4">
            <Suspense fallback={<RelatedArtistsFallback />}>
              <RelatedArtists artistId={artistId} />
            </Suspense>
          </Flex>
        </Box>
      </Stack>
    </WithHeader>
  );
};

const TopTracks: VFC<{ artistId: string }> = ({ artistId }) => {
  const { data: topTracks } = useArtistTopTracks([artistId, "jp"]);

  return (
    <>
      {topTracks?.tracks.map((track, index) => (
        <Track key={track.id} index={index} track={track} />
      ))}
    </>
  );
};

const TopTracksFallback: VFC = () => {
  return (
    <>
      {[...range(0, 10)].map((i) => (
        <TrackSkeleton hasThumbnail key={i} />
      ))}
    </>
  );
};

const Albums: VFC<{ artistId: string }> = ({ artistId }) => {
  const { data: artistAlbums } = useArtistAlbums([artistId, { limit: 10 }]);

  return (
    <>
      {artistAlbums?.items.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </>
  );
};

const AlbumsFallback: VFC = () => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </>
  );
};

const RelatedArtists: VFC<{ artistId: string }> = ({ artistId }) => {
  const { data: artistRelatedArtists } = useArtistRelatedArtists([artistId]);

  return (
    <>
      {artistRelatedArtists?.artists.map((artist) => (
        <ArtistCard key={artist.id} artist={artist} />
      ))}
    </>
  );
};

const RelatedArtistsFallback: VFC = () => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
};
