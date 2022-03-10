import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { VFC } from "react";
import { MdLightMode, MdDarkMode, MdLogout, MdPerson } from "react-icons/md";
import { useMe } from "../../hooks/spotify-api";
import { pagesPath } from "../../lib/$path";

export const Header: VFC<FlexProps> = ({ children, ...props }) => {
  const { toggleColorMode } = useColorMode();

  return (
    <Flex
      {...props}
      as="header"
      px="4"
      py="2"
      gap="2"
      alignItems="center"
      justifyContent="space-between">
      <Box flex={1}>{children}</Box>
      <HStack>
        <IconButton
          aria-label="toggle theme color"
          variant="ghost"
          icon={<Icon fontSize="2xl" as={useColorModeValue(MdDarkMode, MdLightMode)} />}
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
        <Avatar size="sm" name={data?.display_name} src={data?.images?.[0]?.url} />
      </MenuButton>
      <MenuList>
        <NextLink passHref href={pagesPath.me.$url()}>
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
