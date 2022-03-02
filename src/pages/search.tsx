import { withAuth } from "../lib/withAuth";
import { SearchPage } from "../components/pages/Search";

export type OptionalQuery = {
  q?: string;
};

export default withAuth(SearchPage);
