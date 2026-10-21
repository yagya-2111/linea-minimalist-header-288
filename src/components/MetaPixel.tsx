import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

type MetaPixelFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
  }
}

// The Meta pixel base code is installed in index.html <head>.
// This component only reports PageView events for SPA route changes;
// the initial page view is tracked by the base code itself.
const MetaPixel = () => {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
};

export default MetaPixel;
