import { Box, Heading, useColorModeValue, Wrap, WrapItem } from "@chakra-ui/react";
import { memo, Suspense, useCallback, useRef, VFC } from "react";
import { useUser, useUserPlaylistsInfinite } from "../../hooks/spotify-api";
import { range } from "../../lib/range";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { InfiniteScroll } from "../shared/InfiniteScroll";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCard, PlaylistCardSkeleton } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const UserPlaylistsPage: VFC<{ userId: string }> = ({ userId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <UserPageContent userId={userId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const UserPageContent: VFC<{ userId: string }> = ({ userId }) => {
  const { data: user } = useUser([userId]);

  return (
    <WithHeader
      header={
        <Header position="relative" bgColor={useColorModeValue("white", "gray.800")}>
          <Heading as="h1" fontSize="md" noOfLines={1}>
            {user?.display_name}&apos;s playlists
          </Heading>
        </Header>
      }>
      <Box px="4" spacing="8" marginTop="16" paddingBottom="24">
        <UserPlaylists userId={userId} />
      </Box>
    </WithHeader>
  );
};

const UserPlaylists: VFC<{ userId: string }> = memo(({ userId }) => {
  const { data: playlistsQueries, setSize } = useUserPlaylistsInfinite({
    userId,
    limit: 50,
  });

  const isReachingEnd =
    playlistsQueries && playlistsQueries[playlistsQueries.length - 1].next === null;

  const onReachEnd = useCallback(() => setSize((s) => s + 1), [setSize]);

  const scrollTargetRef = useRef<HTMLLIElement>(null);

  return (
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
  );
});

if (process.env.NODE_ENV === "development") {
  UserPlaylists.displayName = "UserPlaylists";
}
