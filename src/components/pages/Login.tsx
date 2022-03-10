import { Button, Center, Image } from "@chakra-ui/react";
import { VFC } from "react";
import { staticPath } from "../../lib/$path";

export const LoginPage: VFC = () => {
  return (
    <Center position="fixed" inset={0}>
      <Button
        as="a"
        href="/api/login"
        variant="ghost"
        size="lg"
        fontSize="2xl"
        fontWeight="bold"
        rightIcon={
          <Image h="8" src={staticPath.assets.Spotify_Logo_RGB_Green_png} alt="Spotify" />
        }>
        Sign in with
      </Button>
    </Center>
  );
};
