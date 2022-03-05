import { NextPage } from "next";
import { useRouter } from "next/router";
import { PlaylistPage } from "../../components/pages/Playlist";
import { withAuth } from "../../lib/withAuth";

const Page: NextPage = () => {
  const router = useRouter();
  const playlistId = router.query.playlistId as string;
  return <PlaylistPage playlistId={playlistId} />;
};

export default withAuth(Page);
