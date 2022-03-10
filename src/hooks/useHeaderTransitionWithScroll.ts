import { RefObject, useCallback, useState } from "react";

export const useHeaderTransitionWithScroll = (
  scrollDetectorRef: RefObject<HTMLElement>,
  transitionStart: number,
  transitionEnd: number,
) => {
  const [headerOpacity, setHeaderBgOpacity] = useState(0);

  const scrollHandler = useCallback(() => {
    const top = Math.abs(scrollDetectorRef.current?.getBoundingClientRect().top ?? 0);

    const calculated = (top - transitionStart) / (transitionEnd - transitionStart);

    setHeaderBgOpacity(calculated < 0 ? 0 : 1 < calculated ? 1 : calculated);
  }, [scrollDetectorRef, transitionEnd, transitionStart]);

  return { headerOpacity, scrollHandler };
};
