import React from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./state";
import { App } from "./App";
import { isNative } from "./services/native";
import { requestPersistence } from "./db/db";

declare const __APP_VERSION__: string;

if ("serviceWorker" in navigator && !isNative() && location.protocol.startsWith("http") && !location.hostname.match(/^(localhost|127\.)/)) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
requestPersistence();

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>
);
