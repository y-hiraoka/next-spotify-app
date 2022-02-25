import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoginPage } from "../components/pages/Login";
import { useAccessToken } from "../hooks/spotify-client";

const Login: NextPage = () => {
  const router = useRouter();
  const token = useAccessToken();

  useEffect(() => {
    if (token !== undefined) {
      router.replace("/");
    }
  }, [router, token]);

  if (token !== undefined) return null;

  return <LoginPage />;
};

export default Login;
