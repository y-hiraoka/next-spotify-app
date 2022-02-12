import { Grid, Icon, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { VFC } from "react";
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

export const BottomNavigation: VFC = () => {
  const router = useRouter();
  const homeIsActive = router.pathname === pagesPath.$url().pathname;
  const searchIsActive = router.pathname === pagesPath.search.$url().pathname;
  const libraryIsActive = router.pathname === pagesPath.library.$url().pathname;

  return (
    <Grid
      width="full"
      templateColumns="repeat(3, 1fr)"
      bgColor={useColorModeValue("gray.200", "gray.900")}
      px="2"
    >
      <NextLink href="/" passHref>
        <VStack as="a" spacing="0" py="2" color={useLinkColor(homeIsActive)}>
          <Icon as={homeIsActive ? MdHome : MdOutlineHome} fontSize="3xl" />
          <Text as="span" fontSize="xs" fontWeight={homeIsActive ? "bold" : undefined}>
            Home
          </Text>
        </VStack>
      </NextLink>
      <NextLink href={pagesPath.search.$url()} passHref>
        <VStack as="a" spacing="0" py="2" color={useLinkColor(searchIsActive)}>
          <Icon as={MdSearch} fontSize="3xl" />
          <Text as="span" fontSize="xs" fontWeight={searchIsActive ? "bold" : undefined}>
            Search
          </Text>
        </VStack>
      </NextLink>
      <NextLink href={pagesPath.library.$url()} passHref>
        <VStack as="a" spacing="0" py="2" color={useLinkColor(libraryIsActive)}>
          <Icon
            as={libraryIsActive ? MdLibraryMusic : MdOutlineLibraryMusic}
            fontSize="3xl"
          />
          <Text as="span" fontSize="xs" fontWeight={libraryIsActive ? "bold" : undefined}>
            My Library
          </Text>
        </VStack>
      </NextLink>
    </Grid>
  );
};
