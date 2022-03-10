import {
  Box,
  HStack,
  Icon,
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
import { MdMusicNote, MdPodcasts } from "react-icons/md";
import { useHoveredBgColor } from "../../hooks/useHoveredBgColor";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath } from "../../lib/$path";
import { formatDurationMS } from "../../lib/formatDurationMS";

export const PlaylistTrack: VFC<{
  playlistTrack: SpotifyApi.PlaylistTrackObject;
}> = ({ playlistTrack }) => {
  return (
    <HStack p="2" height="16" spacing="4" _hover={{ bgColor: useHoveredBgColor() }}>
      {playlistTrack.track.type === "episode" ? (
        <Icon as={MdPodcasts} color="gray.500" />
      ) : (
        <Icon as={MdMusicNote} color="gray.500" />
      )}
      <NextLink
        href={
          playlistTrack.track.type === "episode"
            ? // @ts-expect-error an error of the .d.ts
              pagesPath.shows._showId(playlistTrack.track.album.id).$url()
            : pagesPath.albums._albumId(playlistTrack.track.album.id).$url()
        }
        passHref>
        <Box w="10" h="10" as="a">
          <Image
            src={(playlistTrack.track as SpotifyApi.TrackObjectFull).album.images[0]?.url}
            w="10"
            h="10"
            alt={(playlistTrack.track as SpotifyApi.TrackObjectFull).album.name}
          />
        </Box>
      </NextLink>
      <Stack spacing="0" flex={1}>
        <Text as="div" fontWeight="bold" noOfLines={1} wordBreak="break-all">
          {playlistTrack.track.name}
        </Text>
        <Text
          as="div"
          noOfLines={1}
          wordBreak="break-all"
          fontSize="sm"
          color={useSecondaryTextColor()}>
          {playlistTrack.track.type === "episode" ? (
            <NextLink
              // @ts-expect-error an error of the .d.ts
              href={pagesPath.shows._showId(playlistTrack.track.album.id).$url()}
              passHref>
              {/* @ts-expect-error an error of the .d.ts */}
              <Link>{playlistTrack.track.album.name}</Link>
            </NextLink>
          ) : (
            <NextLink
              href={pagesPath.artists._artistId(playlistTrack.track.artists[0].id).$url()}
              passHref>
              <Link>{playlistTrack.track.artists[0].name}</Link>
            </NextLink>
          )}
        </Text>
      </Stack>
      <Text fontSize="sm">{formatDurationMS(playlistTrack.track.duration_ms)}</Text>
    </HStack>
  );
};

export const PlaylistTrackSkeleton: VFC<{ hasThumbnail: boolean }> = () => {
  return (
    <HStack height="16" p="2" spacing="4">
      <Box w="5" />
      <Skeleton height="10" width="10" />
      <Stack spacing="3" flex={1}>
        <SkeletonText noOfLines={1} />
        <SkeletonText noOfLines={1} />
      </Stack>
      <SkeletonText noOfLines={1}>00:00</SkeletonText>
    </HStack>
  );
};
