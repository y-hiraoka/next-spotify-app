import { Container, Link } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useAccessToken } from "../state/token";

const Home: NextPage = () => {
  const accessToken = useAccessToken();

  return (
    <Container py="8" maxW="container.sm">
      <Link href="/api/login">Sign in with Spotify</Link>
      <pre>{JSON.stringify(accessToken, null, 2)}</pre>
    </Container>
  );
};

export default Home;
