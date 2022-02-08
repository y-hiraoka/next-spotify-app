import { useEffect, useRef, useState } from "react";
import { useBreakpointValue as useChakraBreakpointValue } from "@chakra-ui/react";

type Values<T> = (Record<string, T> | T[]) & {
  base: any;
}

/**
 * Hook that exposes the result of Chakra UI `useBreakpointValue` but hydrates the result
 * on the first SSR render.
 *
 * This is done to avoid the "className did not match between server and client" error
 * that happens in `@chakra-ui/react@1.0.1`.
 *
 * Refer to:
 * https://github.com/chakra-ui/chakra-ui/issues/2601
 *
 * TODO: Check if this has been fixed in newer versions and remove this hook.
 *
 * @param values Values as accepted in `useBreakpointValue`.
 */
function useBreakpointValue<T = any>(values: Values<T>): T | undefined {
  const firstRender = useRef(true);
  const [, setTick] = useState(0);

  const result = useChakraBreakpointValue(values);

  /**
   * Force a re-render after the first SSR render and ensures the return value
   * of the hook on next render will be the result of the original hook.
   */
  useEffect(() => {
    if (firstRender.current) {
      setTick((prev) => prev + 1);

      firstRender.current = false;
    }
  }, []);

  if (firstRender.current) {
    return values.base;
  }

  return result;
}

export default useBreakpointValue;