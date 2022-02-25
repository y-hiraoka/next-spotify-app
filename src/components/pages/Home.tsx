import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import { Suspense, VFC } from "react";
import {
  useFeaturedPlaylists,
  useFollowedArtists,
  useMyTopArtists,
  useMyTopTracks,
} from "../../hooks/spotify-api";
import { ArtistCardSkeleton, ArtistCard } from "../shared/ArtistCard";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCardSkeleton, PlaylistCard } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { TrackSkeleton, Track } from "../shared/Track";
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
  const followedArtists = useFollowedArtists([{ limit: 10 }]);
  const featuredPlaylists = useFeaturedPlaylists([]);
  const myTopArtists = useMyTopArtists([]);
  const myTopTracks = useMyTopTracks([]);

  return (
    <WithHeader header={<Header position="relative" />}>
      <Stack px="4" spacing="8" marginTop="16">
        <Stack>
          <Heading fontSize="xl">Following</Heading>
          <Box overflowX="auto" w="full">
            <HStack alignItems="flex-start" spacing="5">
              {followedArtists.data === undefined
                ? [0, 1, 2, 3, 4, 5].map((i) => <ArtistCardSkeleton key={i} />)
                : followedArtists.data?.artists.items.map((item) => (
                    <ArtistCard key={item.id} artist={item} />
                  ))}
            </HStack>
          </Box>
        </Stack>
        <Stack>
          <Heading fontSize="xl">Featured Playlists</Heading>
          <Box overflowX="auto" w="full">
            <HStack alignItems="flex-start" spacing="5">
              {featuredPlaylists.data === undefined
                ? [0, 1, 2, 3, 4, 5].map((i) => <PlaylistCardSkeleton key={i} />)
                : featuredPlaylists.data.playlists.items.map((item) => (
                    <PlaylistCard key={item.id} playlist={item} />
                  ))}
            </HStack>
          </Box>
        </Stack>
        <Stack>
          <Heading fontSize="xl">My Top Artists</Heading>
          <Box overflowX="auto" w="full">
            <HStack alignItems="flex-start" spacing="5">
              {myTopArtists.data === undefined
                ? [0, 1, 2, 3, 4, 5].map((i) => <ArtistCardSkeleton key={i} />)
                : myTopArtists.data.items.map((item) => (
                    <ArtistCard key={item.id} artist={item} />
                  ))}
            </HStack>
          </Box>
        </Stack>
        <Stack>
          <Heading fontSize="xl">My Top Tracks</Heading>
          <Stack spacing="1">
            {myTopTracks.data === undefined
              ? [0, 1, 2, 3, 4, 5].map((i) => <TrackSkeleton key={i} hasThumbnail />)
              : myTopTracks.data.items.map((item, index) => (
                  <Track key={item.id} track={item} index={index} />
                ))}
          </Stack>
        </Stack>
      </Stack>
    </WithHeader>
  );
};
