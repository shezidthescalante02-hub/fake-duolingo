// Puente mínimo con Capacitor sin depender de @capacitor/core en el bundle web.
declare global {
  interface Window {
    Capacitor?: any;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    webkitAudioContext?: any;
  }
}

export function isNative(): boolean {
  const c = window.Capacitor;
  return !!(c && typeof c.isNativePlatform === "function" ? c.isNativePlatform() : c?.platform && c.platform !== "web");
}

export function hasPlugin(name: string): boolean {
  const c = window.Capacitor;
  if (!c || !isNative()) return false;
  const headers: any[] = c.PluginHeaders || [];
  return headers.some((h) => h.name === name);
}

export function call<T = any>(plugin: string, method: string, options: any = {}): Promise<T> {
  const c = window.Capacitor;
  if (!c?.nativePromise) return Promise.reject(new Error("native-unavailable"));
  return c.nativePromise(plugin, method, options);
}

export function listen(plugin: string, event: string, cb: (data: any) => void): { remove: () => void } {
  const c = window.Capacitor;
  if (!c?.addListener) return { remove: () => {} };
  const h = c.addListener(plugin, event, cb);
  return { remove: () => { try { h?.remove?.(); } catch {} } };
}
