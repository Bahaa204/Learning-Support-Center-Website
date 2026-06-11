import { readSettings } from "@/helper/settings";
import type { AppSettings } from "@/types/settings";
import { useEffect, useState } from "react";

export function useSettings() {
  const SETTINGS_KEY = "Settings";
  // Initialize with validated settings from storage, or defaults if storage is empty/corrupted
  const [Settings, setSettings] = useState<AppSettings>(() =>
    readSettings(SETTINGS_KEY),
  );

  // helper function to update one setting
  function updateSetting<Setting extends keyof AppSettings>(
    setting: Setting,
    value: AppSettings[Setting],
  ) {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  }

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(Settings));
    document.documentElement.setAttribute("data-theme", Settings.theme);
    document.documentElement.setAttribute("data-font-size", Settings.fontSize);

    if (Settings.compactMode) {
      document.documentElement.setAttribute("data-compact", "true");
    } else {
      document.documentElement.removeAttribute("data-compact");
    }
  }, [Settings]);

  return {
    Settings,
    updateSetting,
  };
}
