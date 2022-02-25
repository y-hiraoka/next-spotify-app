import { NextPage } from "next";
import { useRouter } from "next/router";
import { withAuth } from "../../lib/withAuth";
import { ArtistPage } from "../../components/pages/Artist";

const Page: NextPage = () => {
  const router = useRouter();
  const artistId = router.query.artistId as string;
  return <ArtistPage artistId={artistId} />;
};

export default withAuth(Page);
