import { Heading, Stack, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import { Suspense, useCallback, useRef, VFC } from "react";
import { useMySavedAlbumsInfinite } from "../../hooks/spotify-api";
import { range } from "../../lib/range";
import { AlbumCard, AlbumCardSkeleton } from "../shared/AlbumCard";
import { CollectionNavigation } from "../shared/CollectionNavigation";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { InfiniteScroll } from "../shared/InfiniteScroll";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const CollectionAlbumsPage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <CollectionAlbumsPageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const CollectionAlbumsPageContent: VFC = () => {
  const { data: albumsQueries, setSize } = useMySavedAlbumsInfinite({ limit: 50 });

  const isReachingEnd =
    albumsQueries && albumsQueries[albumsQueries.length - 1].next === null;

  const onReachEnd = useCallback(() => setSize((s) => s + 1), [setSize]);

  const scrollTargetRef = useRef<HTMLLIElement>(null);

  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
      <Stack marginTop="16" px="4" paddingBottom="24">
        <CollectionNavigation />
        <Heading as="h1" fontSize="3xl">
          Albums
        </Heading>
        <InfiniteScroll
          isDisabled={isReachingEnd}
          onReachEnd={onReachEnd}
          targetRef={scrollTargetRef}>
          <Wrap spacing="3">
            {albumsQueries?.map((query) =>
              query.items.map(({ album }) => (
                <WrapItem key={album.id}>
                  <AlbumCard album={album} />
                </WrapItem>
              )),
            )}
            {!isReachingEnd && (
              <>
                {[...range(0, 5)].map((i) => (
                  <WrapItem ref={i === 0 ? scrollTargetRef : undefined} key={i}>
                    <AlbumCardSkeleton />
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
