import { MutableRefObject, useEffect, useRef } from "react";

export function usePreviousProps<T>(value: T) {
  const ref: MutableRefObject<T> = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
