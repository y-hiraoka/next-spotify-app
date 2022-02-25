import type { NextApiHandler } from "next";
import nookies from "nookies";
import {
  SPOTIFY_API_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  TOKEN_COOKIE_NAME,
} from "../../common/constant";

const handler: NextApiHandler<string | void> = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send();
    return;
  }

  const refreshToken = nookies.get({ req })[TOKEN_COOKIE_NAME];

  if (refreshToken === undefined) {
    res.status(401).send();
    return;
  }

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  const headers = await fetch(SPOTIFY_API_TOKEN_URL, {
    method: "POST",
    body: params,
  });

  if (headers.ok) {
    const response = await headers.json();

    const newRefreshToken = response.refresh_token || refreshToken;

    nookies.set({ res }, TOKEN_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      path: "/",
    });

    res.send(response.access_token);
    return;
  } else {
    nookies.destroy({ res }, TOKEN_COOKIE_NAME);
    res.status(403).send();
  }
};

export default handler;
