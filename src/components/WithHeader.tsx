import { Box, BoxProps, Grid } from "@chakra-ui/react";
import { ReactNode, VFC } from "react";

export const WithHeader: VFC<{
  header: ReactNode;
  children: ReactNode;
  onScroll?: BoxProps["onScroll"];
}> = ({ header, children, onScroll }) => {
  return (
    <Grid h="full" templateRows="auto 1fr">
      <Box gridColumn="1" gridRow="1" overflow="auto" zIndex={1} h="max-content">
        {header}
      </Box>
      <Box w="full" gridColumn="1" gridRow="1 / 1" overflow="auto" onScroll={onScroll}>
        {children}
      </Box>
    </Grid>
  );
};
