import { NextPage } from "next";
import { useRouter } from "next/router";
import { createElement, useEffect } from "react";
import { useAccessToken } from "../hooks/spotify-client";

export function withAuth<P>(Page: NextPage<P>) {
  const WithAuth: NextPage<P> = (props) => {
    const router = useRouter();
    const accessToken = useAccessToken();

    useEffect(() => {
      if (accessToken === undefined) {
        const from = router.asPath;
        router.replace(`/login?from=${encodeURIComponent(from)}`);
      }
    }, [accessToken, router]);

    if (accessToken === undefined) return null;
    else return createElement(Page, props);
  };

  return WithAuth;
}
