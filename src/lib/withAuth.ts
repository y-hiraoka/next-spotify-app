import { NextPage } from "next";
import { useRouter } from "next/router";
import { createElement, useEffect } from "react";
import { useAccessToken } from "../hooks/spotify-client";
import { pagesPath } from "./$path";

export function withAuth<P>(Page: NextPage<P>) {
  const WithAuth: NextPage<P> = (props) => {
    const router = useRouter();
    const accessToken = useAccessToken();

    useEffect(() => {
      if (accessToken === undefined) {
        router.replace(pagesPath.login.$url());
      }
    }, [accessToken, router]);

    if (accessToken === undefined) return null;
    else return createElement(Page, props);
  };

  return WithAuth;
}
