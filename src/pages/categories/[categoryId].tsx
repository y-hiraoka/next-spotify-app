import { NextPage } from "next";
import { useRouter } from "next/router";
import { CategoryPage } from "../../components/pages/Category";
import { withAuth } from "../../lib/withAuth";

const Page: NextPage = () => {
  const router = useRouter();
  const categoryId = router.query.categoryId as string;
  return <CategoryPage categoryId={categoryId} />;
};

export default withAuth(Page);
