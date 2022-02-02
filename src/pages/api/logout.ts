// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler } from "next";
import nookies from "nookies";

const handler: NextApiHandler = (req, res) => {
  if (req.method === "GET") {
    nookies.destroy({ res }, "next-spotify-app-token", { path: "/" });
    res.redirect("/login");
  } else {
    res.status(405).send("Method not Allowed");
  }
};

export default handler;
