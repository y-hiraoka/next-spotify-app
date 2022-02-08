import { NextPage } from "next";
import { withAuth } from "../lib/withAuth";

const Library: NextPage = () => {
  return <pre>library</pre>;
};

export default withAuth(Library);
