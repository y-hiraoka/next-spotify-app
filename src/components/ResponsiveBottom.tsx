import { Box } from "@chakra-ui/react";
import { VFC } from "react";
import { useIsMobileSize } from "../hooks/useIsMobileSize";
import { BottomNavigation } from "./BottomNavigation";
import { MobileController } from "./MobileController";

export const ResponsiveBottom: VFC = () => {
  const isMobile = useIsMobileSize();

  if (isMobile) {
    return (
      <Box>
        <MobileController />
        <BottomNavigation />
      </Box>
    );
  } else {
    return null;
  }
};
