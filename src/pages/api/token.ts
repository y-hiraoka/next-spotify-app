import type { NextApiHandler } from "next";
import nookies from "nookies";
import {
  SPOTIFY_API_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} from "../../common/constant";
import { AccessToken } from "../../models/token";

const handler: NextApiHandler<AccessToken | void> = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send();
    return;
  }

  const tokenString = nookies.get({ req })["next-spotify-app-token"];

  if (tokenString === undefined) {
    res.status(401).send();
    return;
  }

  const token:AccessToken = JSON.parse(tokenString);

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: token.refresh_token,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  const headers = await fetch(SPOTIFY_API_TOKEN_URL, {
    method: "POST",
    body: params,
  });

  if (headers.ok) {
    const response: AccessToken = await headers.json();

    const newToken: AccessToken = {
      ...response,
      refresh_token: response.refresh_token || token.refresh_token,
    };

    nookies.set({res}, "next-spotify-app-token", JSON.stringify(newToken),{
      httpOnly: true,
      path:"/"
    })

    res.send(newToken);
    return;
  } else {
    nookies.destroy({ res }, "next-spotify-app-session");
    res.status(403).send();
  }
};

export default handler;
