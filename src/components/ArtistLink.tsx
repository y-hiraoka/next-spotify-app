import { Box, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";

export const ArtistCard: VFC<{ artist: SpotifyApi.ArtistObjectFull }> = ({ artist }) => {
  return (
    <NextLink href={`/artists/${artist.id}`} passHref>
      <Stack
        as="a"
        borderRadius="lg"
        p="6"
        bgColor={useColorModeValue("gray.100", "gray.700")}
      >
        <Box height="32" width="32">
          <Image
            height="32"
            width="32"
            src={artist.images[1].url}
            alt={artist.name}
            borderRadius="full"
          />
        </Box>
        <Text as="span" fontWeight="bold" noOfLines={1}>
          {artist.name}
        </Text>
        <Text as="span"  noOfLines={1} fontSize="sm">
          {artist.name}
        </Text>
      </Stack>
    </NextLink>
  );
};
