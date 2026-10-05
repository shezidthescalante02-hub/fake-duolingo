// Recordatorios locales (Android). Personalizables y totalmente desactivables.
import { call, hasPlugin } from "./native";
import { notifMessage } from "../owl/messages";

export interface NotifSettings {
  enabled: boolean;
  times: string[];          // "HH:MM"
  days: number[];           // 1 = domingo … 7 = sábado (convención de Capacitor)
  intensity: "gentle" | "normal" | "savage";
  sound: boolean;
}
export const DEFAULT_NOTIF: NotifSettings = { enabled: false, times: ["19:30"], days: [1, 2, 3, 4, 5, 6, 7], intensity: "normal", sound: false };

export function notifSupported() { return hasPlugin("LocalNotifications"); }

export async function applyNotifications(s: NotifSettings, name: string): Promise<string> {
  if (!notifSupported()) return "Las notificaciones programadas solo funcionan en la app de Android.";
  try {
    const pending = await call<any>("LocalNotifications", "getPending");
    const ids = (pending?.notifications || []).map((n: any) => ({ id: n.id }));
    if (ids.length) await call("LocalNotifications", "cancel", { notifications: ids });
  } catch {}
  if (!s.enabled) return "Recordatorios desactivados.";
  const perm = await call<any>("LocalNotifications", "requestPermissions").catch(() => null);
  if (perm && perm.display && perm.display !== "granted") return "Permiso de notificaciones denegado en Android.";
  try {
    await call("LocalNotifications", "createChannel", {
      id: s.sound ? "fd-sound" : "fd-quiet", name: s.sound ? "Recordatorios" : "Recordatorios silenciosos",
      description: "Recordatorios de estudio de Fake Duolingo", importance: s.sound ? 3 : 2, visibility: 1, vibration: s.sound,
    });
  } catch {}
  const notifications: any[] = [];
  let id = 1000;
  for (const d of s.days) for (const t of s.times) {
    const [hour, minute] = t.split(":").map(Number);
    const m = notifMessage(s.intensity, name);
    notifications.push({
      id: id++, title: m.title, body: m.body,
      schedule: { on: { weekday: d, hour, minute }, allowWhileIdle: true },
      channelId: s.sound ? "fd-sound" : "fd-quiet",
    });
  }
  await call("LocalNotifications", "schedule", { notifications });
  return `${notifications.length} recordatorios programados.`;
}
