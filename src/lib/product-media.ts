import fs from "node:fs";
import path from "node:path";

import type { ProductCategory } from "@/lib/products-db";

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function isImageFile(name: string) {
  const low = name.toLowerCase();
  return IMG_EXT.some((ext) => low.endsWith(ext));
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** AirPods Pro 2 ↔ папка `AirPods pro2` и т.п. */
function slugEqualsLoose(a: string, b: string) {
  if (a === b) return true;
  const norm = (s: string) => s.replace(/-(\d)/g, "$1");
  return norm(a) === norm(b);
}

function splitRelSegments(rel: string) {
  return rel.split(/[/\\]/).filter(Boolean);
}

function applewatchLineKey(label: string) {
  return label
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, "")
    .replace(/^apple/i, "");
}

function safeReadDir(dir: string) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function listDirs(dir: string) {
  return safeReadDir(dir).filter((d) => d.isDirectory()).map((d) => d.name);
}

/** Убирает повторы с тем же NFC (разная нормализация Unicode в имени файла / в URL). */
function dedupeStringsNfcPreserveOrder(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.normalize("NFC");
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function listImages(dir: string) {
  const names = safeReadDir(dir)
    .filter((d) => d.isFile() && isImageFile(d.name))
    .map((d) => d.name);
  const unique = dedupeStringsNfcPreserveOrder(names);
  return unique.sort((a, b) => a.localeCompare(b, "ru"));
}

function dirExists(dir: string) {
  try {
    return fs.statSync(dir).isDirectory();
  } catch {
    return false;
  }
}

/** Папка в `public/` с учётом регистра (AirPods → `AirPods`) */
export function categoryFsSegment(category: ProductCategory): string {
  if (category === "airpods") return "AirPods";
  return category;
}

function publicPath(...parts: string[]) {
  return "/" + parts.map((p) => p.replaceAll("\\", "/")).join("/");
}

function publicFsPath(...parts: string[]) {
  return path.join(process.cwd(), "public", ...parts);
}

/** Корпус/циферблат (глад) → прочие кадры → типичные папки только ремешка/браслета. */
function watchFolderSortKey(name: string): number {
  const n = name.toLowerCase();
  if (/глад/i.test(n)) return 0;
  if (
    /ребр|ремеш|ребро|алп|альп|альпий|alpine|трейл|trail|loop|юпит|милан|milan|океан|ocean|кожан|кожа|ткан|нейлон|nylon|solo|link|плет|нато|nato|strap|band|браслет|петля|спорт.?банд|sport.?band/i.test(
      n
    )
  )
    return 2;
  return 1;
}

function sortAppleWatchModelFolders(names: string[]) {
  return [...names].sort(
    (a, b) =>
      watchFolderSortKey(a) - watchFolderSortKey(b) ||
      a.localeCompare(b, "ru")
  );
}

/** Оценка пути от modelDir: глад → остальное → ремешок (для rel и для URL). */
function appleWatchGallerySortScore(pathOrUrl: string): number {
  const norm = pathOrUrl.replace(/\\/g, "/").toLowerCase();
  const segments = norm.split("/").filter(Boolean);
  const file = segments.length > 0 ? segments[segments.length - 1]! : norm;
  const bandInSeg = segments.some((seg) =>
    /ребр|ремеш|ребро|strap|band|браслет|петля|алп|альп|альпий|alpine|трейл|trail|loop|милан|milan|океан|ocean|кожан|ткан|нейлон|nylon|solo|link|плет|нато|nato|спорт.?банд|sport.?band/i.test(
      seg
    )
  );
  const bandInFile =
    /ребр|ремеш|ребро|strap|band|браслет|_strap|_band|-strap|-band/i.test(
      file
    );
  if (bandInSeg || bandInFile) return 2;
  if (norm.includes("/глад/") || segments.some((s) => /^глад$/i.test(s)))
    return 0;
  return 1;
}

/** При равном score — файлы с явным маркером ремешка в имени уходят в конец. */
function watchStrapBasenamePenalty(basename: string): number {
  const f = basename.toLowerCase();
  return /_strap|_band|_ремень|_remesh|-strap|-band\.|(^|[^a-zа-яё])ремеш/u.test(f)
    ? 1
    : 0;
}

function compareAppleWatchPaths(a: string, b: string): number {
  const da = appleWatchGallerySortScore(a) - appleWatchGallerySortScore(b);
  if (da !== 0) return da;
  const fa = splitRelSegments(a).pop() ?? a;
  const fb = splitRelSegments(b).pop() ?? b;
  const pa = watchStrapBasenamePenalty(fa) - watchStrapBasenamePenalty(fb);
  if (pa !== 0) return pa;
  return a.localeCompare(b, "ru");
}

function sortAppleWatchRelPaths(rels: string[]): string[] {
  return [...rels].sort(compareAppleWatchPaths);
}

/** Корпус/циферблат первыми; папки/файлы ремешка — последними (верное превью карточки). */
function orderAppleWatchGallery(urls: string[]): string[] {
  return [...urls].sort(compareAppleWatchPaths);
}

function colorDirectoryCandidates(color: string): string[] {
  const pairs: Record<string, string> = {
    белые: "белый",
    белый: "белые",
    чёрные: "чёрный",
    чёрный: "чёрные",
    синие: "синий",
    синий: "синие",
  };
  const alt = pairs[color];
  return alt ? [color, alt] : [color];
}

/** Реальное имя подпапки цвета в `modelDir` (как в `readdir`), чтобы пути совпадали с файлами на диске и в URL. */
function resolveColorDirName(modelDir: string, color: string): string | null {
  const dirs = listDirs(modelDir);
  if (dirs.length === 0) return null;

  const want = new Set<string>();
  for (const c of colorDirectoryCandidates(color)) {
    want.add(c.normalize("NFC"));
  }
  want.add(color.normalize("NFC"));

  for (const d of dirs) {
    const dn = d.normalize("NFC");
    if (want.has(dn)) return d;
  }
  return null;
}

function colorFileStemHint(color: string): string | null {
  const map: Record<string, string> = {
    белые: "белый",
    белый: "белый",
    чёрные: "чёрный",
    чёрный: "чёрный",
    синие: "синий",
    синий: "синий",
  };
  return map[color] ?? null;
}

function findModelDirInFamily(familyDir: string, title: string): string | null {
  const direct = path.join(familyDir, title);
  if (dirExists(direct)) return direct;
  const want = toSlug(title);
  for (const name of listDirs(familyDir)) {
    const sn = toSlug(name);
    if (sn === want || slugEqualsLoose(sn, want)) return path.join(familyDir, name);
  }
  return null;
}

function resolveModelDirectory(args: {
  category: ProductCategory;
  root: string;
  familyName: string;
  familyDir: string;
  title: string;
}): string | null {
  const { category, root, familyDir, familyName, title } = args;
  if (category === "iphone") {
    const d = path.join(root, title);
    return dirExists(d) ? d : null;
  }
  const tf = toSlug(familyName);
  const tt = toSlug(title);
  if (
    familyName === title ||
    tf === tt ||
    (category === "airpods" && slugEqualsLoose(tf, tt)) ||
    (category === "applewatch" &&
      applewatchLineKey(familyName) === applewatchLineKey(title))
  ) {
    return familyDir;
  }
  return findModelDirInFamily(familyDir, title);
}

/**
 * Изображения для варианта `color`: подпапка цвета, вложенные папки (Ultra 2),
 * либо плоские файлы в `modelDir` (AirPods без уровня цвета).
 * Возвращает относительные сегменты пути от `modelDir`.
 */
function collectVariantImages(
  modelDir: string,
  color: string,
  category?: ProductCategory
): string[] {
  const sortRels = (rels: string[]) =>
    category === "applewatch" ? sortAppleWatchRelPaths(rels) : rels;

  const tryColorDir = (c: string): string[] | null => {
    const colorPath = path.join(modelDir, c);
    if (!dirExists(colorPath)) return null;

    const direct = listImages(colorPath);
    if (direct.length > 0) {
      return sortRels(direct.map((img) => path.join(c, img)));
    }

    const subs = listDirs(colorPath);
    const sortedSubs =
      category === "applewatch"
        ? [...subs].sort(
            (a, b) =>
              watchFolderSortKey(a) - watchFolderSortKey(b) ||
              a.localeCompare(b, "ru")
          )
        : [...subs].sort((a, b) => a.localeCompare(b, "ru"));
    const nested: string[] = [];
    for (const sub of sortedSubs) {
      const subPath = path.join(colorPath, sub);
      for (const img of listImages(subPath)) {
        nested.push(path.join(c, sub, img));
      }
      if (category === "applewatch" && nested.length > 0) break;
    }
    if (nested.length > 0) return sortRels(nested);
    return null;
  };

  const resolved = resolveColorDirName(modelDir, color);
  if (resolved) {
    const got = tryColorDir(resolved);
    if (got && got.length > 0) return got;
  }

  for (const c of colorDirectoryCandidates(color)) {
    const got = tryColorDir(c);
    if (got && got.length > 0) return got;
  }

  const flat = listImages(modelDir);
  if (flat.length === 0) return [];

  const hint = colorFileStemHint(color);
  if (hint) {
    const h = hint.toLowerCase();
    const filtered = flat.filter((f) => f.toLowerCase().includes(h));
    if (filtered.length > 0) return sortRels(filtered);
  }

  return sortRels(flat);
}

function toUrlSegments(
  category: ProductCategory,
  familyName: string,
  title: string,
  rel: string
): string[] {
  const seg = categoryFsSegment(category);
  const sub = splitRelSegments(rel);

  if (category === "iphone") {
    return [seg, title, ...sub];
  }

  const titleMatchesFamily =
    familyName === title ||
    toSlug(familyName) === toSlug(title) ||
    (category === "airpods" && slugEqualsLoose(toSlug(familyName), toSlug(title))) ||
    (category === "applewatch" &&
      applewatchLineKey(familyName) === applewatchLineKey(title));
  if (titleMatchesFamily) {
    return [seg, familyName, ...sub];
  }
  return [seg, familyName, title, ...sub];
}

export type CategoryFamily = {
  category: ProductCategory;
  familyName: string;
  familySlug: string;
  previewUrl: string | null;
  modelNames: string[];
};

export function getCategoryFamilies(category: ProductCategory): CategoryFamily[] {
  const seg = categoryFsSegment(category);
  const root = publicFsPath(seg);
  const urlSeg = seg;
  const families = listDirs(root);

  return families.map((familyName) => {
    const familySlug = toSlug(familyName);
    const familyDir = path.join(root, familyName);

    let modelNames: string[] = [];

    if (category === "iphone") {
      modelNames = [familyName];
    } else {
      const sub = listDirs(familyDir);
      if (sub.length === 0 && listImages(familyDir).length > 0) {
        modelNames = ["."];
      } else {
        modelNames = sub;
      }
      if (category === "applewatch") {
        modelNames = sortAppleWatchModelFolders(modelNames);
      } else {
        modelNames = [...modelNames].sort((a, b) => a.localeCompare(b, "ru"));
      }
    }

    let previewUrl: string | null = null;
    for (const modelName of modelNames) {
      const modelDir =
        category === "iphone"
          ? path.join(familyDir)
          : modelName === "."
            ? familyDir
            : path.join(familyDir, modelName);
      const colors = listDirs(modelDir).sort((a, b) => a.localeCompare(b, "ru"));

      let imgs: string[] = [];
      let col0 = "";
      let sub0: string | null = null;

      if (colors.length === 0) {
        imgs = listImages(modelDir);
        if (imgs.length === 0) continue;
      } else {
        for (const col of colors) {
          const base = path.join(modelDir, col);
          imgs = listImages(base);
          if (imgs.length > 0) {
            col0 = col;
            break;
          }
          const subs = listDirs(base);
          const sortedSubs =
            category === "applewatch"
              ? [...subs].sort(
                  (a, b) =>
                    watchFolderSortKey(a) - watchFolderSortKey(b) ||
                    a.localeCompare(b, "ru")
                )
              : [...subs].sort((a, b) => a.localeCompare(b, "ru"));
          for (const sub of sortedSubs) {
            imgs = listImages(path.join(base, sub));
            if (imgs.length > 0) {
              col0 = col;
              sub0 = sub;
              break;
            }
          }
          if (imgs.length > 0) break;
        }
        if (imgs.length === 0) continue;
      }

      let url: string;
      if (category === "iphone") {
        url = publicPath(urlSeg, familyName, col0, imgs[0]);
      } else if (modelName === ".") {
        url = publicPath(urlSeg, familyName, imgs[0]);
      } else if (colors.length === 0) {
        url = publicPath(urlSeg, familyName, modelName, imgs[0]);
      } else if (sub0) {
        url = publicPath(urlSeg, familyName, modelName, col0, sub0, imgs[0]);
      } else {
        url = publicPath(urlSeg, familyName, modelName, col0, imgs[0]);
      }

      if (category === "applewatch") {
        const candUrls: string[] = [];
        if (modelName === "." || colors.length === 0) {
          candUrls.push(url);
        } else {
          for (const col of colors) {
            for (const rel of collectVariantImages(modelDir, col, category)) {
              const fullRel = `${modelName}/${rel}`.replace(/\\/g, "/");
              candUrls.push(
                publicPath(
                  ...toUrlSegments(
                    category,
                    familyName,
                    familyName,
                    fullRel
                  )
                )
              );
            }
          }
        }
        previewUrl = orderAppleWatchGallery(candUrls)[0] ?? url;
      } else {
        previewUrl = url;
      }
      break;
    }

    return { category, familyName, familySlug, previewUrl, modelNames };
  });
}

export function getProductGalleryImages(args: {
  category: ProductCategory;
  title: string;
  color: string;
}): string[] {
  const { category, title, color } = args;
  const seg = categoryFsSegment(category);
  const root = publicFsPath(seg);
  const families = listDirs(root);

  for (const familyName of families) {
    const familyDir = path.join(root, familyName);
    const modelDir = resolveModelDirectory({
      category,
      root,
      familyName,
      familyDir,
      title,
    });
    if (!modelDir) continue;

    if (category === "iphone") {
      const resolvedIphone = resolveColorDirName(modelDir, color);
      const iphoneCandidates = resolvedIphone
        ? [resolvedIphone]
        : colorDirectoryCandidates(color);
      for (const c of iphoneCandidates) {
        const colorDir = path.join(modelDir, c);
        if (!dirExists(colorDir)) continue;
        const images = listImages(colorDir);
        if (images.length > 0) {
          const urls = dedupeStringsNfcPreserveOrder(
            images.map((img) => publicPath(seg, title, c, img))
          );
          return urls;
        }
      }
      continue;
    }

    const relPaths = dedupeStringsNfcPreserveOrder(
      collectVariantImages(modelDir, color, category)
    );
    if (relPaths.length === 0) continue;

    const urls = dedupeStringsNfcPreserveOrder(
      relPaths.map((rel) =>
        publicPath(...toUrlSegments(category, familyName, title, rel))
      )
    );

    if (urls.length > 0) {
      return category === "applewatch"
        ? orderAppleWatchGallery(urls)
        : urls;
    }
  }

  return [];
}