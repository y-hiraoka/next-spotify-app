import { NextPage } from "next";
import { withAuth } from "../lib/withAuth";
import { useMySavedTracks } from "../hooks/spotify-api";
import { ResponsiveBottom } from "../components/ResponsiveBottom";
import { Layout } from "../components/Layout";
import { SideNavigation } from "../components/SideNavigation";

const Search: NextPage = () => {
  const query = useMySavedTracks();

  return (
    <Layout bottom={<ResponsiveBottom />} side={<SideNavigation />}>
      <pre>
        {JSON.stringify(
          query.data?.items.map((i) => i.track.name),
          null,
          2
        )}
      </pre>
    </Layout>
  );
};

export default withAuth(Search);
