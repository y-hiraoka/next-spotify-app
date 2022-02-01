import { NextPage } from "next";
import { useRouter } from "next/router";
import { withAuth } from "../../lib/withAuth";
import { useArtist } from "../../hooks/spotify-api";

const ArtistPage: NextPage = () => {
  const router = useRouter();

  const artistQuery = useArtist(router.query.artistId as string);

  return <pre>{JSON.stringify(artistQuery.data, null, 2)}</pre>;
};

export default withAuth(ArtistPage);
