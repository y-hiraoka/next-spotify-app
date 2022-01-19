import { ComponentProps, ReactNode, useCallback, VFC } from "react";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { useAccessToken } from "../state/token";

export const WebPlaybackProvider: VFC<{ children: ReactNode }> = ({ children }) => {
  const accessToken = useAccessToken();

  const getOAuthToken: ComponentProps<typeof WebPlaybackSDK>["getOAuthToken"] =
    useCallback(
      (callback) => callback(accessToken?.access_token ?? ""),
      [accessToken?.access_token]
    );

  if (accessToken === undefined) {
    return <>{children}</>;
  } else {
    return (
      <WebPlaybackSDK
        getOAuthToken={getOAuthToken}
        connectOnInitialized
        deviceName="Yosuke Spotify App"
      >
        {children}
      </WebPlaybackSDK>
    );
  }
};
