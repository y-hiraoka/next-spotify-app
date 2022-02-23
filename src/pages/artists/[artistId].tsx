import { NextPage } from "next";
import { useRouter } from "next/router";
import { withAuth } from "../../lib/withAuth";
import { useArtist, useArtistTopTracks } from "../../hooks/spotify-api";
import { Layout } from "../../components/Layout";
import { SideNavigation } from "../../components/SideNavigation";
import { ResponsiveBottom } from "../../components/ResponsiveBottom";
import { Header } from "../../components/Header";
import { WithHeader } from "../../components/WithHeader";
import {
  Box,
  Center,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdPlayArrow } from "react-icons/md";
import { useRef } from "react";

const ArtistPage: NextPage = () => {
  const router = useRouter();

  const artist = useArtist([router.query.artistId as string]);
  const topTracksQuery = useArtistTopTracks([router.query.artistId as string, "jp"]);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
      <WithHeader
        header={
          <Header>
            <Text as="span" fontSize="sm" fontWeight="bold">
              {artist.data?.name}
            </Text>
          </Header>
        }
        onScroll={(event) => console.log(ref.current?.getBoundingClientRect())}
      >
        <Box position="relative" height="45%">
          <Box
            w="full"
            h="full"
            bgImage={`url(${artist.data?.images[0].url})`}
            bgColor="transparent"
            bgSize="cover"
            bgPosition="center"
          />
          <Box
            position="absolute"
            w="full"
            h="full"
            top={0}
            left={0}
            bgGradient="linear(to-b, blackAlpha.300, blackAlpha.700)"
            bgSize="cover"
          />
          <Heading
            as="h1"
            position="absolute"
            bottom={0}
            left={0}
            p="4"
            color="white"
            noOfLines={3}
          >
            {artist.data?.name}
          </Heading>
        </Box>
        <IconButton
          aria-label="play an artist context"
          variant="solid"
          icon={<Icon as={MdPlayArrow} fontSize="4xl" />}
          height="14"
          width="14"
          position="sticky"
          top="16"
          left="4"
          marginTop="4"
          borderRadius="full"
          bgColor="green.500"
          color="black"
        />
        <pre>{JSON.stringify(topTracksQuery.data, null, 2)}</pre>
      </WithHeader>
    </Layout>
  );
};

export default withAuth(ArtistPage);
