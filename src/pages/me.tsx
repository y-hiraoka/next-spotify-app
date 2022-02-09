import {
  Avatar,
  Button,
  Container,
  Heading,
  Table,
  Tbody,
  Td,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { useMe } from "../hooks/spotify-api";
import { withAuth } from "../lib/withAuth";

const AboutMe: NextPage = () => {
  const { data: me } = useMe();

  return (
    <Container>
      <VStack py="8" spacing="4">
        <Avatar size="xl" name={me?.display_name} src={me?.images?.at(0)?.url} />
        <Heading
          as="h1"
          fontSize="xl"
          textAlign="center"
          noOfLines={2}
          wordBreak="break-all"
        >
          {me?.display_name}
        </Heading>
        <Button
          variant="outline"
          as="a"
          href="https://www.spotify.com/account/profile/"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Edit my profile
        </Button>
      </VStack>
      <Table mt="8" w="fit-content" mx="auto">
        <Tbody>
          <Tr>
            <Td fontWeight="bold">ID</Td>
            <Td wordBreak="break-all">{me?.id}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">Country</Td>
            <Td wordBreak="break-all">{me?.country}</Td>
          </Tr>
          <Tr>
            <Td fontWeight="bold">Email</Td>
            <Td wordBreak="break-all">{me?.email}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Container>
  );
};

export default withAuth(AboutMe);
