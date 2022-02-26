import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import { Suspense, VFC } from "react";
import {
  useFollowedArtists,
  useFeaturedPlaylists,
  useMyTopArtists,
  useMyTopTracks,
} from "../../hooks/spotify-api";
import { range } from "../../lib/range";
import { ArtistCard, ArtistCardSkeleton } from "../shared/ArtistCard";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCard, PlaylistCardSkeleton } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { Track, TrackSkeleton } from "../shared/Track";
import { WithHeader } from "../shared/WithHeader";

export const HomePage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <HomePageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const HomePageContent: VFC = () => {
  return (
    <WithHeader header={<Header position="relative" />}>
      <Stack px="4" spacing="8" marginTop="16">
        <Stack>
          <Heading fontSize="xl">Following</Heading>
          <Box overflowX="auto" w="full">
            <HStack alignItems="flex-start" spacing="5">
              <Suspense fallback={<FollowedArtistsFallback />}>
                <FollowedArtists />
              </Suspense>
            </HStack>
          </Box>
        </Stack>
        <Stack>
          <Heading fontSize="xl">Featured Playlists</Heading>
          <Box overflowX="auto" w="full">
            <HStack alignItems="flex-start" spacing="5">
              <Suspense fallback={<FeaturedPlaylistsFallback />}>
                <FeaturedPlaylists />
              </Suspense>
            </HStack>
          </Box>
        </Stack>
        <Stack>
          <Heading fontSize="xl">My Top Artists</Heading>
          <Box overflowX="auto" w="full">
            <HStack alignItems="flex-start" spacing="5">
              <Suspense fallback={<MyTopArtistsFallback />}>
                <MyTopArtists />
              </Suspense>
            </HStack>
          </Box>
        </Stack>
        <Stack>
          <Heading fontSize="xl">My Top Tracks</Heading>
          <Stack spacing="1">
            <Suspense fallback={<MyTopTracksFallback />}>
              <MyTopTracks />
            </Suspense>
          </Stack>
        </Stack>
      </Stack>
    </WithHeader>
  );
};

const FollowedArtists: VFC = () => {
  const { data: followedArtists } = useFollowedArtists([{ limit: 10 }]);

  return (
    <>
      {followedArtists?.artists.items.map((item) => (
        <ArtistCard key={item.id} artist={item} />
      ))}
    </>
  );
};

const FollowedArtistsFallback: VFC = () => {
  return (
    <>
      {[...range(0, 10)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
};

const FeaturedPlaylists: VFC = () => {
  const { data: featuredPlaylists } = useFeaturedPlaylists([]);

  return (
    <>
      {featuredPlaylists?.playlists.items.map((item) => (
        <PlaylistCard key={item.id} playlist={item} />
      ))}
    </>
  );
};

const FeaturedPlaylistsFallback: VFC = () => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <PlaylistCardSkeleton key={i} />
      ))}
    </>
  );
};

const MyTopArtists: VFC = () => {
  const { data: myTopArtists } = useMyTopArtists([]);

  return (
    <>
      {myTopArtists?.items.map((item) => (
        <ArtistCard key={item.id} artist={item} />
      ))}
    </>
  );
};

const MyTopArtistsFallback: VFC = () => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
};

const MyTopTracks: VFC = () => {
  const { data: myTopTracks } = useMyTopTracks([]);

  return (
    <>
      {myTopTracks?.items.map((item, index) => (
        <Track key={item.id} track={item} index={index} />
      ))}
    </>
  );
};

const MyTopTracksFallback: VFC = () => {
  return (
    <>
      {[...range(0, 20)].map((i) => (
        <TrackSkeleton hasThumbnail key={i} />
      ))}
    </>
  );
};
