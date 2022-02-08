import { NextPage } from "next";
import { useRouter } from "next/router";
import { withAuth } from "../../lib/withAuth";
import { useArtistTopTracks } from "../../hooks/spotify-api";
import { Box } from "@chakra-ui/react";

const ArtistPage: NextPage = () => {
  const router = useRouter();

  const topTracksQuery = useArtistTopTracks(router.query.artistId as string, "jp");

  return (
    <Box>
      <pre>{JSON.stringify(topTracksQuery.data, null, 2)}</pre>
    </Box>
  );
};

export default withAuth(ArtistPage);
