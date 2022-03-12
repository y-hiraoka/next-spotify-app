import { HStack, Center, Icon, Stack, Text } from "@chakra-ui/react";
import { VFC, useCallback } from "react";
import { MdSpeaker, MdSmartphone, MdComputer } from "react-icons/md";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";
import { useMyDevices } from "../../hooks/spotify-api";
import { useSpotifyClient } from "../../hooks/spotify-client";
import { useSecondaryTextColor } from "../../hooks/useSecondaryTextColor";

export const MyDevices: VFC = () => {
  const { data: myDevices, mutate: mutateMyDevices } = useMyDevices();
  const onChangeDevice = useCallback(() => mutateMyDevices(), [mutateMyDevices]);

  return (
    <Stack>
      {myDevices?.devices.map((device) => (
        <Device key={device.id} device={device} onChangeDevice={onChangeDevice} />
      ))}
    </Stack>
  );
};

const Device: VFC<{
  device: SpotifyApi.UserDevice;
  onChangeDevice?: (deviceId: string) => void;
}> = ({ device, onChangeDevice }) => {
  const secondaryTextColor = useSecondaryTextColor();
  const spotifyClient = useSpotifyClient();
  const thisDevice = usePlayerDevice();

  const handleClick = useCallback(async () => {
    if (!device.is_active && device.id) {
      await spotifyClient.transferMyPlayback([device.id]);
      onChangeDevice && onChangeDevice(device.id);
    }
  }, [device.id, device.is_active, onChangeDevice, spotifyClient]);

  return (
    <HStack
      as="button"
      onClick={handleClick}
      spacing="4"
      p="2"
      color={device.is_active ? "green.600" : undefined}
      textAlign="inherit"
      _hover={{ bgColor: "blackAlpha.200" }}>
      <Center>
        <Icon
          as={
            device.type === "Speaker"
              ? MdSpeaker
              : device.type === "Smartphone"
              ? MdSmartphone
              : MdComputer
          }
          fontSize="4xl"
        />
      </Center>
      <Stack spacing="0" flex={1}>
        <Text as="div" fontWeight="bold">
          {device.name}
          {device.id === thisDevice?.device_id && " (this app)"}
        </Text>
        <Text
          as="div"
          fontSize="sm"
          color={device.is_active ? undefined : secondaryTextColor}>
          Spotify Connect
        </Text>
      </Stack>
    </HStack>
  );
};
