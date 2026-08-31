import type { AppSettings } from "@/types/settings";

const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  fontSize: "normal",
  compactMode: false,
  pageSize: 5,
  exportFormat: "csv",
  archiveRetention: 30,
};

export function isAppSettings(value: any): value is AppSettings {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AppSettings>;

  return (
    (candidate.theme === "system" ||
      candidate.theme === "light" ||
      candidate.theme === "dark") &&
    (candidate.fontSize === "normal" || candidate.fontSize === "large") &&
    typeof candidate.compactMode === "boolean" &&
    (candidate.pageSize === 5 ||
      candidate.pageSize === 10 ||
      candidate.pageSize === 25 ||
      candidate.pageSize === 50 ||
      candidate.pageSize === 100) &&
    (candidate.exportFormat === "csv" || candidate.exportFormat === "excel") &&
    typeof candidate.archiveRetention === "number" &&
    candidate.archiveRetention >= 30 &&
    candidate.archiveRetention <= 730
  );
}

export function readSettings(settings_key: string): AppSettings {
  const rawSettings = window.localStorage.getItem(settings_key);

  // No settings saved yet use defaults
  if (!rawSettings) {
    return DEFAULT_SETTINGS;
  }

  try {
    const parsedSettings = JSON.parse(rawSettings);

    // Only accept if the shape matches AppSettings (theme, fontSize, compactMode)
    if (isAppSettings(parsedSettings)) {
      return parsedSettings;
    }
  } catch {
    // JSON.parse failed; storage is corrupted. Fall back to defaults.
  }

  return DEFAULT_SETTINGS;
}
