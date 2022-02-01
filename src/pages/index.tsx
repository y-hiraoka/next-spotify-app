import { Box, Heading, HStack, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { ArtistCard, ArtistCardSkeleton } from "../components/ArtistCard";
import { Header } from "../components/Header";
import { withAuth } from "../lib/withAuth";
import {
  useFeaturedPlaylists,
  useFollowedArtists,
  useMyTopArtists,
  useMyTopTracks,
} from "../hooks/spotify-api";
import { PlaylistCard, PlaylistCardSkeleton } from "../components/PlaylistCard";
import { Track } from "../components/Track";

const Home: NextPage = () => {
  const followedArtists = useFollowedArtists({ limit: 10 });
  const featuredPlaylists = useFeaturedPlaylists();
  const myTopArtists = useMyTopArtists();
  const myTopTracks = useMyTopTracks();

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
          <Box>
            {myTopTracks.data?.items.map((item) => (
              <Track key={item.id} track={item} />
            ))}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default withAuth(Home);
