import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const scrollToSection = () => {
      const section = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!section) return false;
      section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      return true;
    };
    const frame = requestAnimationFrame(scrollToSection);
    const observer = new MutationObserver(() => { if (scrollToSection()) observer.disconnect(); });
    observer.observe(document.body, { childList: true, subtree: true });
    const timeout = window.setTimeout(() => observer.disconnect(), 3000);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.clearTimeout(timeout); };
  }, [pathname, hash, key]);

  return null;
};

export default ScrollToTop;