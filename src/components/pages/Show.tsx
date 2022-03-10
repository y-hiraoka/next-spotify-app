import {
  Box,
  Divider,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Fragment, memo, Suspense, useCallback, useRef, VFC } from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useWindowSize } from "react-use";
import { useShow, useShowEpisodesInfinite } from "../../hooks/spotify-api";
import { useHeaderTransitionWithScroll } from "../../hooks/useHeaderTransitionWithScroll";
import { useIsSavedShow } from "../../hooks/useIsSavedShow";
import { usePlayContextURI } from "../../hooks/usePlayContextURI";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { Episode, EpisodeSkeleton } from "../shared/Episode";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { InfiniteScroll } from "../shared/InfiniteScroll";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { SpotifyColorPlayButton } from "../shared/SpotifyColorPlayButton";
import { WithHeader } from "../shared/WithHeader";

export const ShowPage: VFC<{ showId: string }> = ({ showId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <ShowPageContent showId={showId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const ShowPageContent: VFC<{ showId: string }> = ({ showId }) => {
  const { data: show } = useShow([showId]);

  const { height: windowHeight } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);
  const { headerOpacity, scrollHandler } = useHeaderTransitionWithScroll(
    ref,
    100,
    windowHeight * 0.5,
  );

  const { isPlayingContextURI, togglePlayContextURI } = usePlayContextURI(
    show?.uri ?? "",
  );

  const { isSavedShow, toggleIsSavedShow } = useIsSavedShow(showId);

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
              {show?.name}
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
            src={show?.images[0].url}
            alt={show?.name}
          />
          <Box w="full">
            <Heading as="h1" fontSize={["3xl", "4xl", "5xl", "6xl"]}>
              {show?.name}
            </Heading>
            <Flex marginTop="4">
              <Text as="div" fontWeight="bold">
                {show?.publisher}
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
            aria-label="save this show"
            role="checkbox"
            aria-checked={isSavedShow}
            icon={
              <Icon as={isSavedShow ? MdFavorite : MdFavoriteBorder} fontSize="4xl" />
            }
            onClick={toggleIsSavedShow}
            variant="ghost"
            size="lg"
            color={isSavedShow ? "green.600" : undefined}
          />
        </HStack>
        <Stack>
          <Heading fontSize="2xl">Description</Heading>
          <Text color={useSecondaryTextColor()}>{show?.description}</Text>
        </Stack>
        <Stack>
          <Heading fontSize="2xl">Episodes</Heading>
          <Episodes showId={showId} />
        </Stack>
      </Stack>
    </WithHeader>
  );
};

const SIZE_PER_PAGE = 20;
const Episodes: VFC<{ showId: string }> = memo(({ showId }) => {
  const { data, setSize, size } = useShowEpisodesInfinite({
    showId,
    limit: SIZE_PER_PAGE,
  });

  const isEmpty = data?.[0]?.items.length === 0;
  const isReachingEnd =
    isEmpty || (data && SIZE_PER_PAGE * size > data[data.length - 1].total);

  const onReachEnd = useCallback(() => setSize((s) => s + 1), [setSize]);

  const loadingElementRef = useRef<HTMLDivElement>(null);

  return (
    <InfiniteScroll
      isDisabled={isReachingEnd}
      onReachEnd={onReachEnd}
      targetRef={loadingElementRef}>
      {data?.map((episodes) =>
        episodes.items.map((episode, index) => (
          <Fragment key={episode.id}>
            {index === 0 && <Divider />}
            <Episode episode={episode} />
            <Divider />
          </Fragment>
        )),
      )}
      {!isReachingEnd && (
        <Box ref={loadingElementRef}>
          <EpisodeSkeleton />
        </Box>
      )}
    </InfiniteScroll>
  );
});

if (process.env.NODE_ENV === "development") {
  Episodes.displayName = "Episodes";
}
