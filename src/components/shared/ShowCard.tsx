import {
  Box,
  Image,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { pagesPath } from "../../lib/$path";

export const ShowCard: VFC<{ show: SpotifyApi.ShowObjectSimplified }> = ({ show }) => {
  return (
    <NextLink href={pagesPath.shows._showId(show.id).$url()} passHref>
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
            src={show.images[0].url}
            alt={show.name}
            borderRadius="sm"
          />
        </Box>
        <Text
          as="span"
          fontWeight="bold"
          noOfLines={1}
          wordBreak="break-all"
          title={show.name}>
          {show.name}
        </Text>
        <Text as="span" noOfLines={1} fontSize="sm">
          {show.publisher}
        </Text>
      </Stack>
    </NextLink>
  );
};

export const ShowCardSkeleton: VFC = () => {
  return (
    <Stack borderRadius="lg" p="6" bgColor={useColorModeValue("gray.100", "gray.700")}>
      <SkeletonCircle size="32" />
      <Skeleton height="6" />
      <Skeleton height="5" />
    </Stack>
  );
};
