import { Box } from "@chakra-ui/react";
import { Suspense, VFC } from "react";
import { useIsMobileSize } from "../../hooks/useIsMobileSize";
import { BottomNavigation } from "./BottomNavigation";
import { LargerController, LargerControllerSkeleton } from "./LargerController";
import { MobileController, MobileControllerSkeleton } from "./MobileController";

export const ResponsiveBottom: VFC = () => {
  const isMobile = useIsMobileSize();

  if (isMobile) {
    return (
      <Box position="relative">
        <Box position="absolute" bottom="100%" w="full">
          <Suspense fallback={<MobileControllerSkeleton />}>
            <MobileController />
          </Suspense>
        </Box>
        <BottomNavigation />
      </Box>
    );
  } else {
    return (
      <Suspense fallback={<LargerControllerSkeleton />}>
        <LargerController />
      </Suspense>
    );
  }
};
