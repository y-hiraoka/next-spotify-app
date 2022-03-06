import { useColorModeValue } from "@chakra-ui/react";

export function useHoveredBgColor() {
  return useColorModeValue("blackAlpha.100", "gray.700");
}
