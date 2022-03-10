import { Heading, Stack, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import { Suspense, useCallback, useRef, VFC } from "react";
import { useFollowedArtistsInfinite } from "../../hooks/spotify-api";
import { range } from "../../lib/range";
import { ArtistCard, ArtistCardSkeleton } from "../shared/ArtistCard";
import { CollectionNavigation } from "../shared/CollectionNavigation";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { InfiniteScroll } from "../shared/InfiniteScroll";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const CollectionArtistsPage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <CollectionArtistsPageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const CollectionArtistsPageContent: VFC = () => {
  const { data: artistsQueries, setSize } = useFollowedArtistsInfinite({ limit: 50 });

  const isReachingEnd =
    artistsQueries &&
    artistsQueries[artistsQueries.length - 1].artists.cursors.after === null;

  const onReachEnd = useCallback(() => setSize((s) => s + 1), [setSize]);

  const scrollTargetRef = useRef<HTMLLIElement>(null);

  return (
    <WithHeader header={<Header bgColor={useColorModeValue("white", "gray.800")} />}>
      <Stack marginTop="16" px="4" paddingBottom="24">
        <CollectionNavigation />
        <Heading as="h1" fontSize="3xl">
          Artists
        </Heading>
        <InfiniteScroll
          isDisabled={isReachingEnd}
          onReachEnd={onReachEnd}
          targetRef={scrollTargetRef}>
          <Wrap spacing="3">
            {artistsQueries?.map((query) =>
              query.artists.items.map((artist) => (
                <WrapItem key={artist.id}>
                  <ArtistCard artist={artist} />
                </WrapItem>
              )),
            )}
            {!isReachingEnd && (
              <>
                {[...range(0, 5)].map((i) => (
                  <WrapItem ref={i === 0 ? scrollTargetRef : undefined} key={i}>
                    <ArtistCardSkeleton />
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
