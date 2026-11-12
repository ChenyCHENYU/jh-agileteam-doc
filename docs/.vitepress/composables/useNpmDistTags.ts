import { onMounted, ref, type Ref } from "vue";

/**
 * npm registry dist-tags 共享客户端
 *
 * 三个消费方（NpmVersion / PackagesTable / EcosystemTable）统一走这里：
 *  - 轻端点 `/-/package/{pkg}/dist-tags`（仅几百字节，替代全量 packument）
 *  - 模块级 Promise 缓存：同页多个组件查同一包只发一次请求
 *  - sessionStorage 缓存（30 分钟）：跨页面复用，ecosystem 页 ~50 请求大幅收敛
 *  - 失败静默降级：返回 null，组件展示构建时兜底版本
 */

const SESSION_KEY = "npm-dist-tags";
const TTL_MS = 30 * 60 * 1000;

type CacheEntry = { t: number; v: Record<string, string> };

/** 模块级进行中/已完成请求缓存（页面内去重） */
const inflight = new Map<string, Promise<string | null>>();

function readSession(): CacheEntry {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { t: 0, v: {} };
    const parsed = JSON.parse(raw) as CacheEntry;
    return parsed && typeof parsed.t === "number" && parsed.v ? parsed : { t: 0, v: {} };
  } catch {
    return { t: 0, v: {} };
  }
}

function writeSession(pkg: string, version: string) {
  try {
    const cur = readSession();
    cur.v[pkg] = version;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ t: Date.now(), v: cur.v }));
  } catch {
    /* sessionStorage 不可用时忽略 */
  }
}

function readSessionFor(pkg: string): string | null {
  try {
    const cur = readSession();
    if (Date.now() - cur.t > TTL_MS) return null;
    return cur.v[pkg] ?? null;
  } catch {
    return null;
  }
}

/**
 * 查询包的最新版本（dist-tags.latest），带双层缓存。
 * @returns 最新版本号；获取失败返回 null（调用方展示兜底值）
 */
export function fetchNpmLatest(pkg: string): Promise<string | null> {
  const cached = readSessionFor(pkg);
  if (cached) return Promise.resolve(cached);
  if (inflight.has(pkg)) return inflight.get(pkg)!;

  const p = (async () => {
    try {
      // 轻端点：scoped 包名整体编码，如 @scope%2Fname
      const url = `https://registry.npmjs.org/-/package/${encodeURIComponent(pkg)}/dist-tags`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      if (!res.ok) return null;
      const data = (await res.json()) as { latest?: string };
      if (data.latest) writeSession(pkg, data.latest);
      return data.latest ?? null;
    } catch {
      return null;
    } finally {
      inflight.delete(pkg);
    }
  })();
  inflight.set(pkg, p);
  return p;
}

/**
 * 组合式入口：挂载后并发查询一组包，返回响应式版本表。
 * @returns live map：包名 → 最新版本（查询成功才出现）
 */
export function useNpmVersions(pkgs: () => string[]): Ref<Record<string, string>> {
  const live = ref<Record<string, string>>({});
  onMounted(async () => {
    const names = pkgs();
    const results = await Promise.allSettled(names.map((n) => fetchNpmLatest(n)));
    results.forEach((r, i) => {
      if (r.status === "fulfilled" && r.value) live.value[names[i]] = r.value;
    });
  });
  return live;
}
