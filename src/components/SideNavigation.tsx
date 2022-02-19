import {
  Box,
  HStack,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { VFC } from "react";
import { IconType } from "react-icons";
import {
  MdHome,
  MdLibraryMusic,
  MdOutlineHome,
  MdOutlineLibraryMusic,
  MdSearch,
} from "react-icons/md";
import { pagesPath } from "../lib/$path";

const useLinkColor = (isActive: boolean) =>
  useColorModeValue(
    isActive ? "gray.900" : "gray.500",
    isActive ? "gray.100" : "gray.500"
  );

export const SideNavigation: VFC = () => {
  const router = useRouter();
  const homeIsActive = router.pathname === pagesPath.$url().pathname;
  const searchIsActive = router.pathname === pagesPath.search.$url().pathname;
  const libraryIsActive = router.pathname === pagesPath.library.$url().pathname;

  return (
    <Box bgColor={useColorModeValue(undefined, "gray.900")} p="5">
      <NextLink href={pagesPath.$url()} passHref>
        <Box as="a">
          <Image
            src={useColorModeValue(
              "/assets/Spotify_Logo_RGB_Black.png",
              "/assets/Spotify_Logo_RGB_White.png"
            )}
            alt="logo"
            w="full"
            maxW="28"
          />
        </Box>
      </NextLink>
      <Stack marginTop="8" spacing="3">
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
          href={pagesPath.library.$url()}
          icon={libraryIsActive ? MdLibraryMusic : MdOutlineLibraryMusic}
          isActive={libraryIsActive}
        />
      </Stack>
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
        _hover={{ color: useColorModeValue("gray.900", "gray.100") }}
      >
        <Icon as={icon} fontSize="2xl" />
        <Text as="span" fontSize="sm" fontWeight={isActive ? "bold" : undefined}>
          {label}
        </Text>
      </HStack>
    </NextLink>
  );
};
