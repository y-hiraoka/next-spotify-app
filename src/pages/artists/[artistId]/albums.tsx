import { NextPage } from "next";
import { useRouter } from "next/router";
import { ArtistAlbumsPage } from "../../../components/pages/ArtistAlbums";
import { withAuth } from "../../../lib/withAuth";

const Page: NextPage = () => {
  const router = useRouter();
  const artistId = router.query.artistId as string;
  return <ArtistAlbumsPage artistId={artistId} />;
};

export default withAuth(Page);
