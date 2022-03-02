import { useEffect, useState } from "react";

export const useDebounceValue = <T>(value: T, ms = 500) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const timerId = window.setTimeout(() => setState(value), ms);
    return () => window.clearTimeout(timerId);
  }, [ms, value]);

  return state;
};
