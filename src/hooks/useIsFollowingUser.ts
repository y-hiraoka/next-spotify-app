import { useCallback } from "react";
import { useIsFollowingUsers } from "./spotify-api";
import { useSpotifyClient } from "./spotify-client";

export const useIsFollowingUser = (userId: string | undefined | null) => {
  const spotifyClient = useSpotifyClient();

  const { data, mutate } = useIsFollowingUsers(userId ? [[userId]] : null);

  const isFollowingUser = !!data?.[0];

  const toggleIsFollowingUser = useCallback(async () => {
    if (!userId) return;

    if (isFollowingUser) {
      await spotifyClient.unfollowUsers([userId]);
    } else {
      await spotifyClient.followUsers([userId]);
    }

    mutate((prev) => [!prev?.[0]]);
  }, [userId, isFollowingUser, mutate, spotifyClient]);

  return { isFollowingUser, toggleIsFollowingUser };
};
