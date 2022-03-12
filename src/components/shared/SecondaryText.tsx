import { Text, TextProps } from "@chakra-ui/react";
import { VFC } from "react";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";

export const SecondaryText: VFC<TextProps> = (props) => {
  return <Text color={useSecondaryTextColor()} {...props} />;
};
