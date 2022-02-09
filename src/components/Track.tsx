import {
  Box,
  HStack,
  Image,
  Link,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { formatDurationMS } from "../lib/formatDurationMS";

export const Track: VFC<{
  index: number;
  track: SpotifyApi.TrackObjectFull | SpotifyApi.TrackObjectSimplified;
}> = ({ track, index }) => {
  return (
    <HStack
      p="2"
      height="16"
      spacing="4"
      _hover={{ bgColor: useColorModeValue("gray.100", "gray.700") }}
    >
      <Text as="span" w="5" textAlign="right">
        {index + 1}
      </Text>
      {"album" in track && (
        <NextLink href={`/albums/${track.album.id}`} passHref>
          <Box w="10" h="10" as="a">
            <Image src={track.album.images[0].url} w="10" h="10" alt={track.album.name} />
          </Box>
        </NextLink>
      )}
      <Stack spacing="0" flex={1}>
        <Text as="div" fontWeight="bold" noOfLines={1} wordBreak="break-all">
          {track.name}
        </Text>
        <Text
          as="div"
          noOfLines={1}
          wordBreak="break-all"
          fontSize="sm"
          color={useColorModeValue("gray.500", "whiteAlpha.800")}
        >
          <NextLink href={`/artists/${track.artists[0].id}`} passHref>
            <Link>{track.artists[0].name}</Link>
          </NextLink>
        </Text>
      </Stack>
      <Text fontSize="sm">{formatDurationMS(track.duration_ms)}</Text>
    </HStack>
  );
};

export const TrackSkeleton: VFC<{ hasThumbnail: boolean }> = ({ hasThumbnail }) => {
  return (
    <HStack height="16" p="2" spacing="4">
      <Box w="5" />
      {hasThumbnail && <Skeleton height="10" width="10" />}
      <Stack spacing="3" flex={1}>
        <SkeletonText noOfLines={1} />
        <SkeletonText noOfLines={1} />
      </Stack>
      <SkeletonText noOfLines={1}>00:00</SkeletonText>
    </HStack>
  );
};
