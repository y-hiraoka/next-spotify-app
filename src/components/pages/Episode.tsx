import {
  Box,
  Grid,
  Heading,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Suspense, useRef, VFC } from "react";
import { useWindowSize } from "react-use";
import { useEpisode } from "../../hooks/spotify-api";
import { useHeaderTransitionWithScroll } from "../../hooks/useHeaderTransitionWithScroll";
import { usePlayContextURI } from "../../hooks/usePlayContextURI";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath } from "../../lib/$path";
import { formatDurationMS } from "../../lib/formatDurationMS";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { SpotifyColorPlayButton } from "../shared/SpotifyColorPlayButton";
import { WithHeader } from "../shared/WithHeader";

export const EpisodePage: VFC<{ episodeId: string }> = ({ episodeId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <EpisodePageContent episodeId={episodeId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const EpisodePageContent: VFC<{ episodeId: string }> = ({ episodeId }) => {
  const { data: episode } = useEpisode([episodeId]);

  const { height: windowHeight } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);
  const { headerOpacity, scrollHandler } = useHeaderTransitionWithScroll(
    ref,
    100,
    windowHeight * 0.5,
  );

  const { isPlayingContextURI, togglePlayContextURI } = usePlayContextURI(
    episode?.uri ?? "",
  );

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
            <Heading as="h1" fontSize="md" noOfLines={1}>
              {episode?.name}
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
          <Image
            w="64"
            h="64"
            borderRadius="md"
            src={episode?.images[0].url}
            alt={episode?.name}
          />
          <Box w="full">
            <Heading as="h1" fontSize={["3xl", "4xl", "5xl", "6xl"]}>
              {episode?.name}
            </Heading>
            <Heading marginTop="4" fontSize="xl">
              <NextLink
                href={pagesPath.shows._showId(episode?.show.id ?? "").$url()}
                passHref>
                <Link>{episode?.show.publisher}</Link>
              </NextLink>
            </Heading>
          </Box>
        </Grid>
        <Box>{formatDurationMS(episode?.duration_ms ?? 0)}</Box>
        <HStack spacing="4">
          <SpotifyColorPlayButton
            aria-label="play an artist context"
            isPlaying={isPlayingContextURI}
            onClick={togglePlayContextURI}
          />
        </HStack>
        <Stack>
          <Heading fontSize="2xl">Description</Heading>
          <Text color={useSecondaryTextColor()} whiteSpace="pre-wrap">
            {episode?.description}
          </Text>
        </Stack>
        <Text>
          <NextLink
            href={pagesPath.shows._showId(episode?.show.id ?? "").$url()}
            passHref>
            <Link>View all episodes</Link>
          </NextLink>
        </Text>
      </Stack>
    </WithHeader>
  );
};
