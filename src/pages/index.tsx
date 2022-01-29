import { Container, Link, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import { withAuth } from "../lib/withAuth";
import { useArtistTopTracks, useFollowedArtists } from "../state/spotify-api";

const Home: NextPage = () => {
  const { data } = useFollowedArtists();

  return (
    <Container py="8" maxW="container.sm">
      <Stack>
        {data?.artists.items.map((item) => (
          <NextLink key={item.id} href={`/artists/${item.id}`} passHref>
            <Link>{item.name}</Link>
          </NextLink>
        ))}
      </Stack>
    </Container>
  );
};

export default withAuth(Home);
