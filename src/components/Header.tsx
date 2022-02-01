import { Flex, Icon, IconButton, useColorMode } from "@chakra-ui/react";
import { VFC } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

export const Header: VFC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex as="header" height="20" px="8" alignItems="center" justifyContent="flex-end">
      <IconButton
        aria-label="toggle theme color"
        variant="ghost"
        icon={
          <Icon fontSize="2xl" as={colorMode === "light" ? MdDarkMode : MdLightMode} />
        }
        onClick={toggleColorMode}
      />
    </Flex>
  );
};
