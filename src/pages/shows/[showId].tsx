import { NextPage } from "next";
import { useRouter } from "next/router";
import { ShowPage } from "../../components/pages/Show";
import { withAuth } from "../../lib/withAuth";

const Page: NextPage = () => {
  const router = useRouter();
  const showId = router.query.showId as string;
  return <ShowPage showId={showId} />;
};

export default withAuth(Page);
