import { Box, Flex, Heading, Image, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { pagesPath, staticPath } from "../../lib/$path";

export const NotFound: VFC = () => {
  return (
    <Flex pt="16" direction="column" alignItems="center">
      <Image src={staticPath.assets.Spotify_Icon_RGB_Green_png} alt="logo" w="20" />
      <Heading as="h1" fontSize={["2xl", "4xl", "5xl"]} textAlign="center" mt="8">
        <Box>404</Box>
        <Box>page was not found</Box>
      </Heading>
      <NextLink href={pagesPath.$url()}>
        <Link fontSize="lg" mt="16">
          Home
        </Link>
      </NextLink>
    </Flex>
  );
};
