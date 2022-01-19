import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useEffect } from "react";
import {
  SPOTIFY_API_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
} from "../common/constant";
import { AccessToken, useSetAccessToken } from "../state/token";

type PageProps = { tokens: AccessToken };

export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
  req,
}) => {
  const stateFromCookie = nookies.get({ req }).state;
  const stateFromQuery = query.state;

  if (
    typeof stateFromCookie === "string" &&
    typeof stateFromQuery === "string" &&
    stateFromCookie === stateFromQuery &&
    typeof query.code === "string"
  ) {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: query.code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      client_id: SPOTIFY_CLIENT_ID,
      client_secret: SPOTIFY_CLIENT_SECRET,
    });

    const headers = await fetch(SPOTIFY_API_TOKEN_URL, {
      method: "POST",
      body: params,
    });

    if (headers.ok) {
      const response: AccessToken = await headers.json();
      return {
        props: { tokens: response },
      };
    }
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};

const Callback: NextPage<PageProps> = ({ tokens }) => {
  const router = useRouter();
  const setAccessToken = useSetAccessToken();

  useEffect(() => {
    setAccessToken(tokens);
    router.replace("/");
  }, [router, setAccessToken, tokens]);

  return null;
};

export default Callback;
