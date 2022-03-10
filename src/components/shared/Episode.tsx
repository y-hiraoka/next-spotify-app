import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { MdPlayArrow } from "react-icons/md";
import { useHoveredBgColor } from "../../hooks/useHoveredBgColor";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath } from "../../lib/$path";

export const Episode: VFC<{
  episode: SpotifyApi.EpisodeObjectSimplified;
}> = ({ episode }) => {
  return (
    <Box position="relative">
      <NextLink href={pagesPath.episodes._episodeId(episode.id).$url()} passHref>
        <HStack
          as="a"
          spacing="4"
          alignItems="flex-start"
          p="3"
          _hover={{ bgColor: useHoveredBgColor() }}>
          <Image
            src={episode.images[0]?.url}
            alt={episode.name}
            w="16"
            h="16"
            borderRadius="md"
          />
          <Stack flex={1}>
            <Text as="div" fontWeight="bold" noOfLines={2} wordBreak="break-all">
              {episode.name}
            </Text>
            <Text
              color={useSecondaryTextColor()}
              fontSize="sm"
              noOfLines={2}
              wordBreak="break-all">
              {episode.description}
            </Text>
            <Flex
              color={useSecondaryTextColor()}
              fontSize="xs"
              height="10"
              alignItems="center"
              gap="2">
              <Box>{episode.release_date}</Box>
            </Flex>
          </Stack>
        </HStack>
      </NextLink>
      <IconButton
        aria-label="play this episode"
        icon={<Icon as={MdPlayArrow} fontSize="2xl" />}
        variant="ghost"
        size="sm"
        position="absolute"
        right="4"
        bottom="4"
        color="black"
        bgColor="gray.100"
        borderRadius="full"
      />
    </Box>
  );
};

export const EpisodeSkeleton: VFC = () => {
  return (
    <HStack spacing="4" alignItems="flex-start" p="3">
      <Skeleton w="16" h="16" borderRadius="md" />
      <Stack spacing="4" flex={1}>
        <SkeletonText w="full" noOfLines={1} />
        <SkeletonText w="full" noOfLines={2} />
        <Flex height="10" pr="1" alignItems="center" justifyContent="space-between">
          <SkeletonText w="20" noOfLines={1} />
          <SkeletonCircle w="8" h="8" />
        </Flex>
      </Stack>
    </HStack>
  );
};
