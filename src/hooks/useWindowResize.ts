import { useEffect } from "react";

export default function useWindowResize(cb: () => void) {
  useEffect(() => {
    cb(); // 初次调用
    window.addEventListener("resize", cb);
    return () => window.removeEventListener("resize", cb);
  }, [cb]);
}
