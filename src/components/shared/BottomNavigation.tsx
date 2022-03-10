import { Grid, Icon, Text, useColorModeValue, VStack } from "@chakra-ui/react";
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
import { pagesPath } from "../../lib/$path";

const useLinkColor = (isActive: boolean) =>
  useColorModeValue(
    isActive ? "gray.900" : "gray.500",
    isActive ? "gray.100" : "gray.500",
  );

export const BottomNavigation: VFC = () => {
  const router = useRouter();
  const homeIsActive = router.pathname === pagesPath.$url().pathname;
  const searchIsActive = router.pathname === pagesPath.search.$url().pathname;
  const libraryIsActive = router.pathname.startsWith("/collection");

  return (
    <Grid
      width="full"
      templateColumns="repeat(3, 1fr)"
      bgColor={useColorModeValue("gray.200", "gray.900")}
      px="2">
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
    </Grid>
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
      <VStack as="a" spacing="0" py="1.5" color={useLinkColor(isActive)}>
        <Icon as={icon} fontSize="2xl" />
        <Text as="span" fontSize="xs" fontWeight={isActive ? "bold" : undefined}>
          {label}
        </Text>
      </VStack>
    </NextLink>
  );
};
