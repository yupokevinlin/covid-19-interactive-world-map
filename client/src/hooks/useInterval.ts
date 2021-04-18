import React, {useState, useEffect, useRef, MutableRefObject} from 'react';

export function useInterval(callback: any, delay: number) {
  const savedCallback: MutableRefObject<any> = useRef();
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}