import { Box, Heading, HStack, Stack, useColorModeValue } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { useWindowSize } from "react-use";
import { withAuth } from "../../lib/withAuth";
import {
  useArtist,
  useArtistTopTracks,
  useMyCurrentPlaybackState,
} from "../../hooks/spotify-api";
import { Layout } from "../../components/Layout";
import { SideNavigation } from "../../components/SideNavigation";
import { ResponsiveBottom } from "../../components/ResponsiveBottom";
import { Header } from "../../components/Header";
import { WithHeader } from "../../components/WithHeader";
import { SpotifyColorPlayButton } from "../../components/SpotifyColorPlayButton";
import { Track } from "../../components/Track";
import { useSpotifyClient } from "../../hooks/spotify-client";

const ArtistPage: NextPage = () => {
  const router = useRouter();
  const { height: windowHeight } = useWindowSize();

  const spotifyClient = useSpotifyClient();
  const { data: playbackState, mutate } = useMyCurrentPlaybackState([]);
  const { data: artist } = useArtist([router.query.artistId as string]);
  const { data: topTracks } = useArtistTopTracks([router.query.artistId as string, "jp"]);

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

  const togglePlayThisArtist = useCallback(async () => {
    if (isPlayingThisArtist) {
      await spotifyClient.pause();
    } else if (playbackState?.context?.uri !== artist?.uri) {
      await spotifyClient.play({ context_uri: artist?.uri });
    } else {
      await spotifyClient.play();
    }
    mutate();
  }, [
    artist?.uri,
    isPlayingThisArtist,
    mutate,
    playbackState?.context?.uri,
    spotifyClient,
  ]);

  return (
    <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
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
            position="absolute"
            bottom={0}
            left={0}
            p="4"
            color="white"
            noOfLines={3}
          >
            {artist?.name}
          </Heading>
        </Box>
        <Stack marginTop="8" px="4" spacing="8">
          <HStack>
            <SpotifyColorPlayButton
              aria-label="play an artist context"
              isPlaying={isPlayingThisArtist}
              onClick={togglePlayThisArtist}
            />
          </HStack>
          <Box>
            <Heading marginBottom="2">Top Tracks</Heading>
            <Stack spacing="1">
              {topTracks?.tracks.map((track, index) => (
                <Track key={track.id} index={index} track={track} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </WithHeader>
    </Layout>
  );
};

export default withAuth(ArtistPage);
