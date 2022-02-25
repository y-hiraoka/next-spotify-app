import { Suspense, VFC } from "react";
import { useMySavedTracks } from "../../hooks/spotify-api";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";

export const SearchPage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <SearchPageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const SearchPageContent: VFC = () => {
  const query = useMySavedTracks([]);

  return (
    <pre>
      {JSON.stringify(
        query.data?.items.map((i) => i.track.name),
        null,
        2
      )}
    </pre>
  );
};
