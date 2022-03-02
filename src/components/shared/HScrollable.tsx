import { Box } from "@chakra-ui/react";
import { ReactNode, VFC } from "react";

export const HScrollable: VFC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Box overflowX="auto" w="full">
      {children}
    </Box>
  );
};
