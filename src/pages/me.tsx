import { NextPage } from "next";
import { useMe } from "../hooks/spotify-api";
import { withAuth } from "../lib/withAuth";

const AboutMe: NextPage = () => {
  const me = useMe();

  return <pre>{JSON.stringify(me.data, null, 2)}</pre>;
};

export default withAuth(AboutMe);
