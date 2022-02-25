import { NextApiHandler } from "next";
import nookies from "nookies";
import {
  SPOTIFY_API_TOKEN_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  TOKEN_COOKIE_NAME,
} from "../../common/constant";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const stateFromCookie = nookies.get({ req }).state;
    const stateFromQuery = req.query.state;

    if (
      typeof stateFromCookie === "string" &&
      typeof stateFromQuery === "string" &&
      stateFromCookie === stateFromQuery &&
      typeof req.query.code === "string"
    ) {
      const params = new URLSearchParams({
        grant_type: "authorization_code",
        code: req.query.code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET,
      });

      const headers = await fetch(SPOTIFY_API_TOKEN_URL, {
        method: "POST",
        body: params,
      });

      if (headers.ok) {
        const response = await headers.json();

        nookies.set({ res }, TOKEN_COOKIE_NAME, response.refresh_token, {
          httpOnly: true,
          path: "/",
        });

        res.redirect("/");
      } else {
        res.status(403);
      }
    }
  } else {
    res.status(405);
  }
};

export default handler;
