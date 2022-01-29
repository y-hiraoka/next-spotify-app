import { Box, Button, Heading, HStack, Stack, useColorMode } from "@chakra-ui/react";
import type { NextPage } from "next";
import { ArtistCard } from "../components/ArtistLink";
import { withAuth } from "../lib/withAuth";
import { useFollowedArtists } from "../state/spotify-api";

const Home: NextPage = () => {
  const { data } = useFollowedArtists();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box p="8">
      <Stack>
        <Button colorScheme="teal" onClick={toggleColorMode}>
          {colorMode}
        </Button>
        <Heading as="h2" fontSize="xl">
          Following
        </Heading>
        <Box overflowX="auto">
          <HStack alignItems="flex-start" spacing="4">
            {data?.artists.items.map((item) => (
              <ArtistCard key={item.id} artist={item} />
            ))}
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
};

export default withAuth(Home);
