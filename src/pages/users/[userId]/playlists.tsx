import { NextPage } from "next";
import { useRouter } from "next/router";
import { withAuth } from "../../../lib/withAuth";
import { UserPlaylistsPage } from "../../../components/pages/UserPlaylists";

const Page: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  return <UserPlaylistsPage userId={userId} />;
};

export default withAuth(Page);
