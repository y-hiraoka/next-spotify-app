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

export const AlbumCard: VFC<{ album: SpotifyApi.AlbumObjectSimplified }> = ({
  album,
}) => {
  return (
    <NextLink href={pagesPath.albums._albumId(album.id).$url()} passHref>
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
            src={album.images[0].url}
            alt={album.name}
            borderRadius="sm"
          />
        </Box>
        <Text as="span" fontWeight="bold" noOfLines={1} wordBreak="break-all">
          {album.name}
        </Text>
        <Text as="span" noOfLines={1} fontSize="sm">
          Album
        </Text>
      </Stack>
    </NextLink>
  );
};

export const AlbumCardSkeleton: VFC = () => {
  return (
    <Stack borderRadius="lg" p="6" bgColor={useColorModeValue("gray.100", "gray.700")}>
      <SkeletonCircle size="32" />
      <Skeleton height="6" />
      <Skeleton height="5" />
    </Stack>
  );
};
