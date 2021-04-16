import {MutableRefObject, useEffect, useRef} from "react";

export function useEventListener(eventName: string, handler: (e: Event) => any, element: any = window){
  const savedHandler: MutableRefObject<(e: Event) => any> = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const isSupported: boolean = !!element && !!element.addEventListener;
      if (!isSupported) {
        return
      }

      const eventListener = (e: Event) => {
        if (savedHandler && savedHandler.current) {
          savedHandler.current(e);
        }
      };

      element.addEventListener(eventName, eventListener);
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element]
  );
}