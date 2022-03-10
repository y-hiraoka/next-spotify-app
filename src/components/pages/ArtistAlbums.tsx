import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { memo, Suspense, VFC } from "react";
import { useArtist, useArtistAlbums } from "../../hooks/spotify-api";
import { range } from "../../lib/range";
import { AlbumCardSkeleton, AlbumCard } from "../shared/AlbumCard";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Header } from "../shared/Header";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";
import { WithHeader } from "../shared/WithHeader";

export const ArtistAlbumsPage: VFC<{ artistId: string }> = ({ artistId }) => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <ArtistAlbumsPageContent artistId={artistId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const ArtistAlbumsPageContent: VFC<{ artistId: string }> = ({ artistId }) => {
  const { data: artist } = useArtist([artistId]);

  return (
    <WithHeader
      header={
        <Header bgColor={useColorModeValue("white", "gray.800")}>
          <Heading as="h1" fontSize="md" flex={1}>
            {artist?.name}&apos;s albums
          </Heading>
        </Header>
      }>
      <Flex px="4" gap="4" pt="20" pb="24" wrap="wrap" justifyContent="center">
        <Suspense fallback={<AlbumsFallback />}>
          <Albums artistId={artistId} />
        </Suspense>
      </Flex>
    </WithHeader>
  );
};

const Albums: VFC<{ artistId: string }> = memo(({ artistId }) => {
  const { data: artistAlbums } = useArtistAlbums([artistId, { limit: 50 }]);

  return (
    <>
      {artistAlbums?.items.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </>
  );
});

const AlbumsFallback: VFC = memo(() => {
  return (
    <>
      {[...range(0, 10)].map((i) => (
        <AlbumCardSkeleton key={i} />
      ))}
    </>
  );
});

if (process.env.NODE_ENV === "development") {
  Albums.displayName = "Albums";
  AlbumsFallback.displayName = "AlbumsFallback";
}
