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

    // Getting the OS theme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function ApplyTheme() {
      // checking if the theme is set to system
      // If yes, check the OS theme preference and set the theme accordingly
      // If not, set the theme to the selected theme
      const actualTheme =
        Settings.theme === "system"
          ? mediaQuery.matches
            ? "dark"
            : "light"
          : Settings.theme;

      document.documentElement.setAttribute("data-theme", actualTheme);
    }

    ApplyTheme();

    if (Settings.theme === "system") {
      // Listen for changes in the OS theme preference
      mediaQuery.addEventListener("change", ApplyTheme);

      return () => {
        mediaQuery.removeEventListener("change", ApplyTheme);
      };
    }

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
