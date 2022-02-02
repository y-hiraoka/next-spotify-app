import { Button, Center, Container, Image } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccessToken } from "../hooks/spotify-client";

const Login: NextPage = () => {
  const router = useRouter();
  const token = useAccessToken();

  const { from } = router.query;

  const query =
    typeof from === "string"
      ? `?from=${encodeURIComponent(from)}`
      : Array.isArray(from)
      ? `?from=${encodeURIComponent(from[0])}`
      : "";

  useEffect(() => {
    if (token !== undefined) {
      router.replace("/");
    }
  }, [router, token]);

  if (token !== undefined) return null;

  return (
    <Center position="fixed" inset={0}>
      <Button
        as="a"
        href={"/api/login" + query}
        variant="ghost"
        size="lg"
        fontSize="2xl"
        fontWeight="bold"
        rightIcon={<Image h="8" src="/assets/Spotify_Logo_RGB_Green.png" alt="Spotify" />}
      >
        Sign in with
      </Button>
    </Center>
  );
};

export default Login;
