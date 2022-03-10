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
import { Suspense, VFC } from "react";
import { useMe } from "../../hooks/spotify-api";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import { Layout } from "../shared/Layout";
import { PageFallback } from "../shared/PageFallback";
import { ResponsiveBottom } from "../shared/ResponsiveBottom";
import { SideNavigation } from "../shared/SideNavigation";

export const MePage: VFC = () => {
  return (
    <ErrorBoundary>
      <Layout side={<SideNavigation />} bottom={<ResponsiveBottom />}>
        <Suspense fallback={<PageFallback />}>
          <MePageContent />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

const MePageContent: VFC = () => {
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
          wordBreak="break-all">
          {me?.display_name}
        </Heading>
        <Button
          variant="outline"
          as="a"
          href="https://www.spotify.com/account/profile/"
          size="sm"
          target="_blank"
          rel="noopener noreferrer">
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
