import { Flex, HStack, Icon, IconButton, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { MdLightMode, MdDarkMode, MdLogout, MdPerson } from "react-icons/md";

export const Header: VFC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex as="header" height="20" px="4" alignItems="center" justifyContent="flex-end">
      <HStack>
        <NextLink passHref href="/me">
          <IconButton
            aria-label="go to my page"
            variant="ghost"
            as="a"
            icon={<Icon fontSize="2xl" as={MdPerson} />}
          />
        </NextLink>
        <IconButton
          aria-label="toggle theme color"
          variant="ghost"
          icon={
            <Icon fontSize="2xl" as={colorMode === "light" ? MdDarkMode : MdLightMode} />
          }
          onClick={toggleColorMode}
        />
        <IconButton
          aria-label="logout"
          variant="ghost"
          as="a"
          href={"/api/logout"}
          icon={<Icon fontSize="2xl" as={MdLogout} />}
        />
      </HStack>
    </Flex>
  );
};
