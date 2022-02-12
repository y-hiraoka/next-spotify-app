import { Box } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState, VFC } from "react";

export const WithBottom: VFC<{
  children: ReactNode;
  bottom: ReactNode;
}> = ({ children, bottom }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [bottomHeight, setBottomHeight] = useState(0);

  useEffect(() => {
    const bottomRect = bottomRef.current?.getBoundingClientRect();
    setBottomHeight(bottomRect?.height ?? 0);
  }, []);

  return (
    <Box h="full">
      <Box>{children}</Box>
      <Box height={`${bottomHeight}px`} />
      <Box ref={bottomRef} position="fixed" bottom={0} left={0} w="full">
        {bottom}
      </Box>
    </Box>
  );
};
