import { Suspense, VFC } from "react";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";

export const LibraryPage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <LibraryPageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const LibraryPageContent: VFC = () => {
  return <pre>library</pre>;
};
