"use client";

import { useEffect } from "react";
import { captureFirstTouch } from "@/lib/product/attribution";

export function AttributionCapture() {
  useEffect(() => {
    captureFirstTouch(window.location.search);
  }, []);
  return null;
}
