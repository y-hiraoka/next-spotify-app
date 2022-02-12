import { NextPage } from "next";
import { withAuth } from "../lib/withAuth";
import { useMySavedTracks } from "../hooks/spotify-api";
import { WithBottom } from "../components/WithBottom";
import { ResponsiveBottom } from "../components/ResponsiveBottom";

const Search: NextPage = () => {
  const query = useMySavedTracks();

  return (
    <WithBottom bottom={<ResponsiveBottom />}>
      <pre>Search</pre>
    </WithBottom>
  );
};

export default withAuth(Search);
