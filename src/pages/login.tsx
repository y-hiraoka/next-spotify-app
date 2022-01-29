import { Container } from "@chakra-ui/react";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();

  const { from } = router.query;

  const query =
    typeof from === "string"
      ? `?from=${encodeURIComponent(from)}`
      : Array.isArray(from)
      ? `?from=${encodeURIComponent(from[0])}`
      : "";

  return (
    <Container p="10">
      <Link href={"/api/login" + query}>Sign in with Spotify</Link>
    </Container>
  );
};

export default Login;
