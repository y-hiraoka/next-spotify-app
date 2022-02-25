import { Box, Grid } from "@chakra-ui/react";
import { ReactNode, VFC } from "react";

export const Layout: VFC<{
  children: ReactNode;
  side: ReactNode;
  bottom: ReactNode;
}> = ({ bottom, children, side }) => {
  return (
    <Grid
      h="full"
      templateColumns={{ base: "1fr", md: "auto 1fr" }}
      templateRows="1fr auto"
    >
      <Box display={{ base: "none", md: "block" }}>{side}</Box>
      <Box overflow="auto">{children}</Box>
      <Box gridColumn="1 / -1">{bottom}</Box>
    </Grid>
  );
};
