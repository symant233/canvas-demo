import { useEffect } from "react";

export default function useWindowResize(cb: () => void) {
  useEffect(() => {
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, [cb]);
}
