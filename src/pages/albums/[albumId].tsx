import { NextPage } from "next";
import { useRouter } from "next/router";
import { withAuth } from "../../lib/withAuth";
import { AlbumPage } from "../../components/pages/Album";

const Page: NextPage = () => {
  const router = useRouter();
  const albumId = router.query.albumId as string;
  return <AlbumPage albumId={albumId} />;
};

export default withAuth(Page);
