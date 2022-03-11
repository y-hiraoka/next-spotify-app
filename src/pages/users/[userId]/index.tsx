import { NextPage } from "next";
import { useRouter } from "next/router";
import { withAuth } from "../../../lib/withAuth";
import { UserPage } from "../../../components/pages/User";

const Page: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  return <UserPage userId={userId} />;
};

export default withAuth(Page);
