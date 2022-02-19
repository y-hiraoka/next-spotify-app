import { NextPage } from "next";
import { Layout } from "../components/Layout";
import { ResponsiveBottom } from "../components/ResponsiveBottom";
import { SideNavigation } from "../components/SideNavigation";
import { withAuth } from "../lib/withAuth";

const Library: NextPage = () => {
  return (
    <Layout bottom={<ResponsiveBottom />} side={<SideNavigation />}>
      <pre>library</pre>
    </Layout>
  );
};

export default withAuth(Library);
