import { NextPage } from "next";
import { useRouter } from "next/router";
import { ArtistPage } from "../../../components/pages/Artist";
import { withAuth } from "../../../lib/withAuth";

const Page: NextPage = () => {
  const router = useRouter();
  const artistId = router.query.artistId as string;
  return <ArtistPage artistId={artistId} />;
};

export default withAuth(Page);
