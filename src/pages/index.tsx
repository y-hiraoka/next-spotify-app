import { Container, Link } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useFollowedArtists } from "../state/spotify-api";

const Home: NextPage = () => {
  const { data } = useFollowedArtists({ limit: 10 });

  return (
    <Container py="8" maxW="container.sm">
      <Link href="/api/login">Sign in with Spotify</Link>
      <pre>{JSON.stringify(data?.artists, null, 2)}</pre>
    </Container>
  );
};

export default Home;
