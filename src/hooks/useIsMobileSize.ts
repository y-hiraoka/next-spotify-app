import useBreakpointValue from "../lib/useBreakPointValue";

export const useIsMobileSize = () => useBreakpointValue({ base: true, md: false });
