import { NextPage } from "next";
import { withAuth } from "../lib/withAuth";
import { useMySavedTracks } from "../hooks/spotify-api";

const Search: NextPage = () => {
  const query = useMySavedTracks();

  return <pre>{JSON.stringify(query.data?.items.map(item => item.track.name), null, 2)}</pre>;
};

export default withAuth(Search);
