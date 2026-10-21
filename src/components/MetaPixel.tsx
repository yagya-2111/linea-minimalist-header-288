import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const META_PIXEL_ID = "1099448742947971";
const CONSENT_REQUIRED_REGIONS = new Set([
  "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR",
  "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MT",
  "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK",
]);

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: MetaPixelFunction;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
    globalPrivacyControl?: boolean;
  }
}

const hasBrowserOptOut = () => {
  const dnt = navigator.doNotTrack;
  return window.globalPrivacyControl === true || dnt === "1" || dnt === "yes";
};

const canLoadPixel = async () => {
  if (hasBrowserOptOut()) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch("/cdn-cgi/trace", {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!response.ok) return false;

    const trace = await response.text();
    const region = trace.match(/^loc=([A-Z0-9]{2})$/m)?.[1];
    if (!region || region === "XX" || region === "T1") return false;
    return !CONSENT_REQUIRED_REGIONS.has(region);
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
};

const ensureMetaPixel = () => {
  if (window.fbq) return;

  const pixel = ((...args: unknown[]) => {
    if (pixel.callMethod) pixel.callMethod(...args);
    else pixel.queue.push(args);
  }) as MetaPixelFunction;
  pixel.queue = [];
  pixel.push = pixel;
  pixel.loaded = true;
  pixel.version = "2.0";
  window.fbq = pixel;
  window._fbq = pixel;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.dataset.metaPixel = META_PIXEL_ID;
  document.head.appendChild(script);

  pixel("init", META_PIXEL_ID, {}, { agent: "lovable" });
};

const MetaPixel = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let active = true;

    void canLoadPixel().then((allowed) => {
      if (active && allowed) {
        ensureMetaPixel();
        window.fbq?.("track", "PageView");
      }
    });

    return () => {
      active = false;
    };
  }, [pathname]);

  return null;
};

export default MetaPixel;
