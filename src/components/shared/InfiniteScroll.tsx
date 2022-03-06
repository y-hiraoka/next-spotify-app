import { ReactNode, RefObject, useEffect, useRef, useState, VFC } from "react";

export const InfiniteScroll: VFC<{
  children: ReactNode;
  onReachEnd?: () => void;
  isDisabled?: boolean;
  targetRef: RefObject<HTMLElement>;
}> = ({ children, onReachEnd, isDisabled, targetRef }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const onReachEndLatest = useRef(onReachEnd);
  onReachEndLatest.current = onReachEnd;

  useEffect(() => {
    if (!targetRef.current) return;

    const targetElement = targetRef.current;

    const observer = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0].isIntersecting);
    });

    observer.observe(targetElement);

    return () => observer.disconnect();
  }, [targetRef]);

  useEffect(() => {
    if (isIntersecting && !isDisabled && onReachEndLatest.current) {
      onReachEndLatest.current();
    }
  }, [isIntersecting, isDisabled]);

  return <div data-infinite-scroll-root>{children}</div>;
};
