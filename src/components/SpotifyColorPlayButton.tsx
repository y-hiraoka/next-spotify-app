import { Icon, IconButton, IconButtonProps, IconProps } from "@chakra-ui/react";
import { VFC } from "react";
import { MdPause, MdPlayArrow } from "react-icons/md";

type Props = {
  "aria-label": string;
  isPlaying: boolean;
  size?: IconButtonProps["height"];
  fontSize?: IconProps["fontSize"];
  onClick?: IconButtonProps["onClick"];
};

export const SpotifyColorPlayButton: VFC<Props> = (props) => {
  return (
    <IconButton
      aria-label={props["aria-label"]}
      variant="solid"
      icon={
        <Icon
          as={props.isPlaying ? MdPause : MdPlayArrow}
          fontSize={props.fontSize ?? "4xl"}
        />
      }
      onClick={props.onClick}
      height={props.size ?? "14"}
      width={props.size ?? "14"}
      borderRadius="full"
      bgColor="green.500"
      color="black"
      boxShadow="sm"
      _hover={{ bgColor: "green.600", transform: "scale(1.05)", boxShadow: "md" }}
      _active={{ bgColor: "green.600" }}
    />
  );
};
