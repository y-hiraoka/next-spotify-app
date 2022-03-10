import {
  Box,
  Circle,
  Icon,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { MdImageNotSupported } from "react-icons/md";
import { pagesPath } from "../../lib/$path";

export const ArtistCard: VFC<{ artist: SpotifyApi.ArtistObjectFull }> = ({ artist }) => {
  return (
    <NextLink href={pagesPath.artists._artistId(artist.id).$url()} passHref>
      <Stack
        width="44"
        as="a"
        borderRadius="lg"
        p="6"
        bgColor={useColorModeValue("gray.100", "gray.700")}
        _hover={{ bgColor: useColorModeValue("gray.200", "gray.600") }}>
        <Box height="32" width="32">
          <Image
            height="32"
            width="32"
            src={artist.images[0]?.url}
            fallback={
              <Circle size="32" bgColor="blackAlpha.300" color="gray.600">
                <Icon as={MdImageNotSupported} fontSize="6xl" />
              </Circle>
            }
            alt={artist.name}
            borderRadius="full"
          />
        </Box>
        <Text as="span" fontWeight="bold" noOfLines={1} wordBreak="break-all">
          {artist.name}
        </Text>
        <Text as="span" noOfLines={1} fontSize="sm">
          Artist
        </Text>
      </Stack>
    </NextLink>
  );
};

export const ArtistCardSkeleton: VFC = () => {
  return (
    <Stack borderRadius="lg" p="6" bgColor={useColorModeValue("gray.100", "gray.700")}>
      <SkeletonCircle size="32" />
      <Skeleton height="6" />
      <Skeleton height="5" />
    </Stack>
  );
};
