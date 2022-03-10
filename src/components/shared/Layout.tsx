import { Box, Grid } from "@chakra-ui/react";
import { ReactNode, VFC } from "react";
import { useIsMobileSize } from "../../hooks/useIsMobileSize";

export const Layout: VFC<{
  children: ReactNode;
  side: ReactNode;
  bottom: ReactNode;
}> = ({ bottom, children, side }) => {
  const isMobile = useIsMobileSize();

  return (
    <Grid
      h="full"
      templateColumns={isMobile ? "1fr" : "auto 1fr"}
      templateRows="1fr auto">
      {!isMobile && <Box>{side}</Box>}
      <Box overflow="auto">{children}</Box>
      <Box gridColumn="1 / -1">{bottom}</Box>
    </Grid>
  );
};
