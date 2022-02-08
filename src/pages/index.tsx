import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { ArtistCard, ArtistCardSkeleton } from "../components/ArtistCard";
import { Header } from "../components/Header";
import { withAuth } from "../lib/withAuth";
import {
  useFeaturedPlaylists,
  useFollowedArtists,
  useMyCurrentPlaybackState,
  useMyTopArtists,
  useMyTopTracks,
} from "../hooks/spotify-api";
import { PlaylistCard, PlaylistCardSkeleton } from "../components/PlaylistCard";
import { Track, TrackSkeleton } from "../components/Track";
import { PlayerController } from "../components/PlayerController";
import { BottomNavigation } from "../components/BottomNavigation";

const Home: NextPage = () => {
  const followedArtists = useFollowedArtists({ limit: 10 });
  const featuredPlaylists = useFeaturedPlaylists();
  const myTopArtists = useMyTopArtists();
  const myTopTracks = useMyTopTracks();
  const playbackState = useMyCurrentPlaybackState();

  return (
    <Box>
      <Header />
      <Stack px="4" spacing="8">
        <Stack>
          <Heading fontSize="xl">Following</Heading>
          <Box overflowX="auto">
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
          <Box overflowX="auto">
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
          <Box overflowX="auto">
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

      <Box position="sticky" bottom="0" width="full">
        <PlayerController />
        <BottomNavigation />
      </Box>
    </Box>
  );
};

export default withAuth(Home);
