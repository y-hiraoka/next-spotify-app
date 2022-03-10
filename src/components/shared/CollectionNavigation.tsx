import { Button, HStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { VFC } from "react";
import { UrlObject } from "url";
import { pagesPath } from "../../lib/$path";

export const CollectionNavigation: VFC = () => {
  return (
    <HStack>
      <NavigationLink href={pagesPath.collection.playlists.$url()} label="Playlists" />
      <NavigationLink href={pagesPath.collection.podcasts.$url()} label="Podcasts" />
      <NavigationLink href={pagesPath.collection.artists.$url()} label="Artists" />
      <NavigationLink href={pagesPath.collection.albums.$url()} label="Albums" />
    </HStack>
  );
};

const NavigationLink: VFC<{
  href: UrlObject;
  label: string;
}> = ({ href, label }) => {
  const router = useRouter();
  const isActive = router.pathname === href.pathname;

  return (
    <NextLink href={href} passHref>
      <Button as="a" variant={isActive ? "solid" : "ghost"}>
        {label}
      </Button>
    </NextLink>
  );
};
