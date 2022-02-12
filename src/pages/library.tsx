import { NextPage } from "next";
import { ResponsiveBottom } from "../components/ResponsiveBottom";
import { WithBottom } from "../components/WithBottom";
import { withAuth } from "../lib/withAuth";

const Library: NextPage = () => {
  return (
    <WithBottom bottom={<ResponsiveBottom />}>
      <pre>library</pre>
    </WithBottom>
  );
};

export default withAuth(Library);
