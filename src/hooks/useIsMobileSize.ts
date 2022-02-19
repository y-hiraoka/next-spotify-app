import { useBreakpointValue } from "@chakra-ui/react";

export const useIsMobileSize = () => useBreakpointValue({ base: true, md: false });
