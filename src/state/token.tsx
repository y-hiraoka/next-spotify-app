import { createContext, ReactNode, useContext, useState, VFC } from "react";

export type AccessToken = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

const AccessTokenContext = createContext<AccessToken | undefined>(undefined);
const SetAccessTokenContext = createContext<(token: AccessToken) => void>(() => {});

export const AccessTokenProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<AccessToken>();

  return (
    <AccessTokenContext.Provider value={token}>
      <SetAccessTokenContext.Provider value={setToken}>
        {children}
      </SetAccessTokenContext.Provider>
    </AccessTokenContext.Provider>
  );
};

export const useAccessToken = () => useContext(AccessTokenContext);
export const useSetAccessToken = () => useContext(SetAccessTokenContext);
