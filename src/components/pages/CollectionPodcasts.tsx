import { Heading, Stack, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import { Suspense, useCallback, useRef, VFC } from "react";
import { useMySavedShowsInfinite } from "../../hooks/spotify-api";
import { range } from "../../lib/range";
import { CollectionNavigation } from "../shared/CollectionNavigation";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { InfiniteScroll } from "../shared/InfiniteScroll";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { ShowCard, ShowCardSkeleton } from "../shared/ShowCard";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const CollectionPodcastsPage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <CollectionPodcastsPageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const CollectionPodcastsPageContent: VFC = () => {
  const { data: showsQueries, setSize } = useMySavedShowsInfinite({ limit: 50 });

  const isReachingEnd =
    showsQueries && showsQueries[showsQueries.length - 1].next === null;

  const onReachEnd = useCallback(() => setSize((s) => s + 1), [setSize]);

  const scrollTargetRef = useRef<HTMLLIElement>(null);

  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
      <Stack marginTop="16" px="4" paddingBottom="24">
        <CollectionNavigation />
        <Heading as="h1" fontSize="3xl">
          Podcasts
        </Heading>
        <InfiniteScroll
          isDisabled={isReachingEnd}
          onReachEnd={onReachEnd}
          targetRef={scrollTargetRef}>
          <Wrap spacing="3">
            {showsQueries?.map((query) =>
              query.items.map(({ show }) => (
                <WrapItem key={show.id}>
                  <ShowCard show={show} />
                </WrapItem>
              )),
            )}
            {!isReachingEnd && (
              <>
                {[...range(0, 5)].map((i) => (
                  <WrapItem ref={i === 0 ? scrollTargetRef : undefined} key={i}>
                    <ShowCardSkeleton />
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
