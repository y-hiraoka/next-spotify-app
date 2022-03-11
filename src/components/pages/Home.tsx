import { Box, Heading, HStack, Stack, useColorModeValue } from "@chakra-ui/react";
import { memo, Suspense, VFC } from "react";
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
import { HScrollable } from "../shared/HScrollable";
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
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
      <Stack px="4" spacing="8" marginTop="16" paddingBottom="24">
        <Stack>
          <Heading fontSize="xl">Following</Heading>
          <HScrollable>
            <HStack alignItems="flex-start" spacing="5">
              <Suspense fallback={<FollowedArtistsFallback />}>
                <FollowedArtists />
              </Suspense>
            </HStack>
          </HScrollable>
        </Stack>
        <Stack>
          <Heading fontSize="xl">Featured Playlists</Heading>
          <HScrollable>
            <HStack alignItems="flex-start" spacing="5">
              <Suspense fallback={<FeaturedPlaylistsFallback />}>
                <FeaturedPlaylists />
              </Suspense>
            </HStack>
          </HScrollable>
        </Stack>
        <Stack>
          <Heading fontSize="xl">My Top Artists</Heading>
          <HScrollable>
            <HStack alignItems="flex-start" spacing="5">
              <Suspense fallback={<MyTopArtistsFallback />}>
                <MyTopArtists />
              </Suspense>
            </HStack>
          </HScrollable>
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

const FollowedArtists: VFC = memo(() => {
  const { data: followedArtists } = useFollowedArtists([{ limit: 10 }]);

  return (
    <>
      {followedArtists?.artists.items.map((item) => (
        <ArtistCard key={item.id} artist={item} />
      ))}
    </>
  );
});

const FollowedArtistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 10)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
});

const FeaturedPlaylists: VFC = memo(() => {
  const { data: featuredPlaylists } = useFeaturedPlaylists([]);

  return (
    <>
      {featuredPlaylists?.playlists.items.map((item) => (
        <PlaylistCard key={item.id} playlist={item} />
      ))}
    </>
  );
});

const FeaturedPlaylistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <PlaylistCardSkeleton key={i} />
      ))}
    </>
  );
});

const MyTopArtists: VFC = memo(() => {
  const { data: myTopArtists } = useMyTopArtists([]);

  return (
    <>
      {myTopArtists?.items.map((item) => (
        <ArtistCard key={item.id} artist={item} />
      ))}
    </>
  );
});

const MyTopArtistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <ArtistCardSkeleton key={i} />
      ))}
    </>
  );
});

const MyTopTracks: VFC = memo(() => {
  const { data: myTopTracks } = useMyTopTracks([]);

  return (
    <>
      {myTopTracks?.items.map((item, index) => (
        <Track key={item.id} track={item} index={index} />
      ))}
    </>
  );
});

const MyTopTracksFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 20)].map((i) => (
        <TrackSkeleton hasThumbnail key={i} />
      ))}
    </>
  );
});

if (process.env.NODE_ENV === "development") {
  FollowedArtists.displayName = "FollowedArtists";
  FollowedArtistsFallback.displayName = "FollowedArtistsFallback";
  FeaturedPlaylists.displayName = "FeaturedPlaylists";
  FeaturedPlaylistsFallback.displayName = "FeaturedPlaylistsFallback";
  MyTopArtists.displayName = "MyTopArtists";
  MyTopArtistsFallback.displayName = "MyTopArtistsFallback";
  MyTopTracks.displayName = "MyTopTracks";
  MyTopTracksFallback.displayName = "MyTopTracksFallback";
}
