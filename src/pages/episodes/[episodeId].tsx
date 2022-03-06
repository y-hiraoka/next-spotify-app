import { NextPage } from "next";
import { useRouter } from "next/router";
import { EpisodePage } from "../../components/pages/Episode";
import { withAuth } from "../../lib/withAuth";

const Page: NextPage = () => {
  const router = useRouter();
  const episodeId = router.query.episodeId as string;
  return <EpisodePage episodeId={episodeId} />;
};

export default withAuth(Page);
