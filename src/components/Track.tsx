import {
  Box,
  Grid,
  Image,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";

const format = (duration_ms: number): string => {
  const seconds = Math.floor(duration_ms / 1000) % 60;
  const minutes = Math.floor(duration_ms / 1000 / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const Track: VFC<{ track: SpotifyApi.TrackObjectFull }> = ({ track }) => {
  return (
    <Grid p="2" gap="3" templateColumns="auto 1fr auto" alignItems="center">
      <NextLink href={`/albums/${track.album.id}`} passHref>
        <Box w="10" h="10" as="a">
          <Image src={track.album.images[0].url} w="10" h="10" alt={track.album.name} />
        </Box>
      </NextLink>
      <Stack spacing="0">
        <Text as="div" fontWeight="bold" noOfLines={1} wordBreak="break-all">
          {track.name}
        </Text>
        <Text as="div" noOfLines={1} wordBreak="break-all" fontSize="sm">
          {track.artists[0].name}
        </Text>
      </Stack>
      <Text fontSize="sm">{format(track.duration_ms)}</Text>
    </Grid>
  );
};

export const PlaylistCardSkeleton: VFC = () => {
  return (
    <Stack borderRadius="lg" p="6" bgColor={useColorModeValue("gray.100", "gray.700")}>
      <Skeleton height="32" width="32" />
      <Skeleton height="6" />
      <Skeleton height="5" />
    </Stack>
  );
};
