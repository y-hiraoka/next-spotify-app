import {
  Avatar,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { MdLightMode, MdDarkMode, MdLogout, MdPerson } from "react-icons/md";
import { useMe } from "../hooks/spotify-api";

export const Header: VFC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex as="header" height="20" px="4" alignItems="center" justifyContent="flex-end">
      <HStack>
        <IconButton
          aria-label="toggle theme color"
          variant="ghost"
          icon={
            <Icon fontSize="2xl" as={colorMode === "light" ? MdDarkMode : MdLightMode} />
          }
          onClick={toggleColorMode}
        />
        <AccountMenu />
      </HStack>
    </Flex>
  );
};

const AccountMenu: VFC = () => {
  const { data } = useMe();

  return (
    <Menu>
      <MenuButton>
        <Avatar size="sm" name={data?.display_name} src={data?.images?.at(0)?.url} />
      </MenuButton>
      <MenuList>
        <NextLink passHref href="/me">
          <MenuItem as="a" icon={<Icon fontSize="xl" as={MdPerson} />}>
            Accout
          </MenuItem>
        </NextLink>
        <MenuItem as="a" icon={<Icon fontSize="xl" as={MdLogout} />} href="/api/logout">
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
