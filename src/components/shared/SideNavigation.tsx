import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Image,
  Divider,
  Link,
  SkeletonText,
} from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { Suspense, VFC } from "react";
import { IconType } from "react-icons";
import {
  MdHome,
  MdLibraryMusic,
  MdOutlineHome,
  MdOutlineLibraryMusic,
  MdSearch,
} from "react-icons/md";
import { useUserPlaylists } from "../../hooks/spotify-api";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";
import { pagesPath, staticPath } from "../../lib/$path";
import { range } from "../../lib/range";

const useLinkColor = (isActive: boolean) => {
  const primaryColor = useColorModeValue("gray.900", "gray.100");
  const secondaryColor = useSecondaryTextColor();
  return isActive ? primaryColor : secondaryColor;
};

export const SideNavigation: VFC = () => {
  const router = useRouter();
  const homeIsActive = router.pathname === pagesPath.$url().pathname;
  const searchIsActive = router.pathname === pagesPath.search.$url().pathname;
  const libraryIsActive = router.pathname.startsWith("/collection");

  return (
    <Box h="full" w="60" bgColor={useColorModeValue(undefined, "gray.900")} p="5">
      <NextLink href={pagesPath.$url()} passHref>
        <HStack as="a">
          <Image
            src={useColorModeValue(
              staticPath.assets.Spotify_Logo_RGB_Black_png,
              staticPath.assets.Spotify_Logo_RGB_White_png,
            )}
            alt="logo"
            w="full"
            maxW="28"
          />
          <Text as="span" fontWeight="bold">
            Clone
          </Text>
        </HStack>
      </NextLink>
      <Stack marginTop="8" spacing="4">
        <NavigationLink
          label="Home"
          href={pagesPath.$url()}
          icon={homeIsActive ? MdHome : MdOutlineHome}
          isActive={homeIsActive}
        />
        <NavigationLink
          label="Search"
          href={pagesPath.search.$url()}
          icon={MdSearch}
          isActive={searchIsActive}
        />
        <NavigationLink
          label="My Library"
          href={pagesPath.collection.playlists.$url()}
          icon={libraryIsActive ? MdLibraryMusic : MdOutlineLibraryMusic}
          isActive={libraryIsActive}
        />
      </Stack>
      <Divider my="4" />
      <Suspense fallback={<PlaylistLinksFallback />}>
        <PlaylistLinks />
      </Suspense>
    </Box>
  );
};

const NavigationLink: VFC<{
  icon: IconType;
  isActive: boolean;
  href: NextLinkProps["href"];
  label: string;
}> = ({ href, isActive, icon, label }) => {
  return (
    <NextLink href={href} passHref>
      <HStack
        as="a"
        color={useLinkColor(isActive)}
        transition="color 0.2s ease"
        _hover={{ color: useColorModeValue("gray.900", "gray.100") }}>
        <Icon as={icon} fontSize="3xl" />
        <Text as="span" fontWeight={isActive ? "bold" : undefined}>
          {label}
        </Text>
      </HStack>
    </NextLink>
  );
};

const PlaylistLinks: VFC = () => {
  const { data: playlists } = useUserPlaylists([]);

  return (
    <Stack>
      {playlists?.items.map((playlist) => (
        <PlaylistLink key={playlist.id} playlist={playlist} />
      ))}
    </Stack>
  );
};

const PlaylistLink: VFC<{
  playlist: SpotifyApi.PlaylistObjectSimplified;
}> = ({ playlist }) => {
  const router = useRouter();
  const href = pagesPath.playlists._playlistId(playlist.id).$url();

  const isActive =
    router.pathname === href.pathname &&
    router.query.playlistId === href.query.playlistId;

  return (
    <NextLink href={href} passHref>
      <Link
        noOfLines={1}
        color={useLinkColor(isActive)}
        fontWeight={isActive ? "bold" : undefined}>
        {playlist.name}
      </Link>
    </NextLink>
  );
};

const PlaylistLinksFallback: VFC = () => {
  return (
    <Stack spacing="4">
      {[...range(0, 5)].map((i) => (
        <SkeletonText key={i} noOfLines={1} />
      ))}
    </Stack>
  );
};
