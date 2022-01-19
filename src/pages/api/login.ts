// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler } from "next";
import { v4 as uuid } from "uuid";
import { stringify } from "querystring";
import {
  SPOTIFY_AUTHORIZE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_SCOPES,
} from "../../common/constant";
import { setCookie } from "nookies";

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") {
    const state = uuid();

    const params = stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: SPOTIFY_SCOPES.join(" "),
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state,
    });

    const secure = !req.headers.host?.includes("localhost");
    setCookie({ res }, "state", state, {
      maxAge: 3600,
      secure: secure,
      httpOnly: true,
      path: "/",
    });

    const url = `${SPOTIFY_AUTHORIZE_URL}?${params}`;

    res.redirect(url);
  } else {
    res.status(405).send("Method not Allowed");
  }
};

export default handler;
