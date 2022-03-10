import { Heading, Stack, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import { Suspense, useCallback, useRef, VFC } from "react";
import { useUserPlaylistsInfinite } from "../../hooks/spotify-api";
import { range } from "../../lib/range";
import { CollectionNavigation } from "../shared/CollectionNavigation";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { InfiniteScroll } from "../shared/InfiniteScroll";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCard, PlaylistCardSkeleton } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const CollectionPlaylistsPage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <CollectionPlaylistsPageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const CollectionPlaylistsPageContent: VFC = () => {
  const { data: playlistsQueries, setSize } = useUserPlaylistsInfinite({ limit: 50 });

  const isReachingEnd =
    playlistsQueries && playlistsQueries[playlistsQueries.length - 1].next === null;

  const onReachEnd = useCallback(() => setSize((s) => s + 1), [setSize]);

  const scrollTargetRef = useRef<HTMLLIElement>(null);

  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
      <Stack marginTop="16" px="4" paddingBottom="24">
        <CollectionNavigation />
        <Heading as="h1" fontSize="3xl">
          Playlists
        </Heading>
        <InfiniteScroll
          isDisabled={isReachingEnd}
          onReachEnd={onReachEnd}
          targetRef={scrollTargetRef}>
          <Wrap spacing="3">
            {playlistsQueries?.map((query) =>
              query.items.map((playlist) => (
                <WrapItem key={playlist.id}>
                  <PlaylistCard playlist={playlist} />
                </WrapItem>
              )),
            )}
            {!isReachingEnd && (
              <>
                {[...range(0, 5)].map((i) => (
                  <WrapItem ref={i === 0 ? scrollTargetRef : undefined} key={i}>
                    <PlaylistCardSkeleton />
                  </WrapItem>
                ))}
              </>
            )}
          </Wrap>
        </InfiniteScroll>
      </Stack>
    </WithHeader>
  );
};
