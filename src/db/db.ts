// IndexedDB minimalista (offline-first). Cada "store" guarda objetos con campo id.
const DB_NAME = "fake-duolingo";
const DB_VERSION = 1;
export const STORES = [
  "kv",        // ajustes, perfil, estado global {id, value}
  "attempts",  // cada respuesta registrada
  "vocab",     // vocabulario personal
  "srs",       // tarjetas de repaso espaciado
  "sessions",  // sesiones de estudio
  "sims",      // simulaciones de examen
  "writing",   // textos escritos y feedback
  "speaking",  // respuestas orales (métricas + transcripción)
  "custom",    // contenido generado o agregado por la usuaria
  "history",   // instantáneas de nivel (evolución)
] as const;
export type StoreName = (typeof STORES)[number];

let dbp: Promise<IDBDatabase> | null = null;
function open(): Promise<IDBDatabase> {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}

function tx<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest | void): Promise<T> {
  return open().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        const r = fn(s);
        t.oncomplete = () => resolve(r ? (r as IDBRequest).result : (undefined as T));
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      })
  );
}

export const db = {
  get<T = any>(store: StoreName, id: string): Promise<T | undefined> {
    return tx<T>(store, "readonly", (s) => s.get(id));
  },
  all<T = any>(store: StoreName): Promise<T[]> {
    return tx<T[]>(store, "readonly", (s) => s.getAll());
  },
  put<T extends { id: string }>(store: StoreName, obj: T): Promise<void> {
    return tx<void>(store, "readwrite", (s) => { s.put(obj); });
  },
  putMany<T extends { id: string }>(store: StoreName, objs: T[]): Promise<void> {
    return tx<void>(store, "readwrite", (s) => { for (const o of objs) s.put(o); });
  },
  del(store: StoreName, id: string): Promise<void> {
    return tx<void>(store, "readwrite", (s) => { s.delete(id); });
  },
  clear(store: StoreName): Promise<void> {
    return tx<void>(store, "readwrite", (s) => { s.clear(); });
  },
  async kvGet<T = any>(key: string, fallback: T): Promise<T> {
    const r = await db.get<{ id: string; value: T }>("kv", key);
    return r ? r.value : fallback;
  },
  kvSet<T = any>(key: string, value: T): Promise<void> {
    return db.put("kv", { id: key, value });
  },
  async exportAll(): Promise<Record<string, any[]>> {
    const out: Record<string, any[]> = {};
    for (const s of STORES) out[s] = await db.all(s);
    return out;
  },
  async importAll(data: Record<string, any[]>): Promise<void> {
    for (const s of STORES) {
      if (!Array.isArray(data[s])) continue;
      await db.clear(s);
      await db.putMany(s, data[s]);
    }
  },
};

export function uid(prefix = ""): string {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// Pedir almacenamiento persistente (evita que el navegador borre datos)
export async function requestPersistence() {
  try { if (navigator.storage?.persist) await navigator.storage.persist(); } catch {}
}
