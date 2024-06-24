import { useEffect } from "react";

export const useDebounce = ({
  dependency,
  debounceFn,
  time,
}: {
  dependency: any;
  debounceFn: () => void;
  time: number;
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      debounceFn();
    }, time);

    return () => clearTimeout(timeout);
  }, [...dependency]);
};
