import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { memo, Suspense, useRef, VFC } from "react";
import { useWindowSize } from "react-use";
import { useUser, useUserPlaylists } from "../../hooks/spotify-api";
import { useHeaderTransitionWithScroll } from "../../hooks/useHeaderTransitionWithScroll";
import { useIsFollowingUser } from "../../hooks/useIsFollowingUser";
import { pagesPath } from "../../lib/$path";
import { range } from "../../lib/range";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { PlaylistCard, PlaylistCardSkeleton } from "../shared/PlaylistCard";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const UserPage: VFC<{ userId: string }> = ({ userId }) => {
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

  const { height: windowHeight } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);
  const { headerOpacity, scrollHandler } = useHeaderTransitionWithScroll(
    ref,
    100,
    windowHeight * 0.5,
  );

  const { isFollowingUser, toggleIsFollowingUser } = useIsFollowingUser(userId);

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
            <Heading as="h1" fontSize="md">
              {user?.display_name}
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
          <Avatar
            w={["56", "56", "64"]}
            h={["56", "56", "64"]}
            name={user?.display_name}
            src={user?.images?.[0]?.url}
          />
          <Box w="full">
            <Heading as="h1" fontSize={["3xl", "4xl", "5xl", "6xl"]}>
              {user?.display_name}
            </Heading>
            <Text marginTop="4">
              <Box as="span" fontWeight="bold">
                {(user?.followers?.total ?? 0).toLocaleString()}
              </Box>{" "}
              Followers
            </Text>
          </Box>
        </Grid>
        <Box>
          <Button size="lg" variant="outline" onClick={toggleIsFollowingUser}>
            {isFollowingUser ? "Following" : "Follow"}
          </Button>
        </Box>
        <Stack>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading fontSize="3xl">Playlists</Heading>
            <NextLink href={pagesPath.users._userId(userId).playlists.$url()} passHref>
              <Link>Show more</Link>
            </NextLink>
          </Flex>
          <Flex w="full" overflowX="auto" gap="4">
            <Suspense fallback={<UserPlaylistsFallback />}>
              <UserPlaylists userId={userId} />
            </Suspense>
          </Flex>
        </Stack>
      </Stack>
    </WithHeader>
  );
};

const UserPlaylists: VFC<{ userId: string }> = memo(({ userId }) => {
  const { data: playlists } = useUserPlaylists([userId, { limit: 10 }]);

  return (
    <>
      {playlists?.items.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </>
  );
});

const UserPlaylistsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 5)].map((i) => (
        <PlaylistCardSkeleton key={i} />
      ))}
    </>
  );
});

if (process.env.NODE_ENV === "development") {
  UserPlaylists.displayName = "UserPlaylists";
  UserPlaylistsFallback.displayName = "UserPlaylistsFallback";
}
