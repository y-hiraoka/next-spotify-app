import { Box, Grid } from "@chakra-ui/react";
import { ReactNode, VFC } from "react";
import { useIsMobileSize } from "../hooks/useIsMobileSize";

export const WithSideBar: VFC<{
  side: ReactNode;
  children: ReactNode;
}> = ({ side, children }) => {
  const isMobileSize = useIsMobileSize();

  return (
    <Grid templateColumns={isMobileSize ? "1fr" : "auto 1fr"}>
      {!isMobileSize && (
        <Box height="full">
          <Box position="sticky" top={0}>
            {side}
          </Box>
        </Box>
      )}
      <Box overflowY="auto">{children}</Box>
    </Grid>
  );
};
