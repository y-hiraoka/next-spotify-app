import { useColorModeValue } from "@chakra-ui/react";

export function useSecondaryTextColor() {
  return useColorModeValue("gray.500", "whiteAlpha.700");
}
