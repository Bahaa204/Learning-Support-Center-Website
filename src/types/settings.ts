export type SettingsTheme = "system" | "light" | "dark";
export type SettingsFontSize = "normal" | "large";
export type SettingsPageSize = 5 | 10 | 25 | 50 | 100;
export type SettingsExportFormat = "csv" | "excel";

export type AppSettings = {
  theme: SettingsTheme;
  fontSize: SettingsFontSize;
  compactMode: boolean;
  pageSize: SettingsPageSize;
  exportFormat: SettingsExportFormat;
  archiveRetention: number;
};

export type AccountInput = {
  displayName: string;
  profilePicture: File | null;
};

export type PasswordInput = {
  newPassword: string;
  confirmNewPassword: string;
};

export type UpdateSettingsFunction = <Setting extends keyof AppSettings>(
  setting: Setting,
  value: AppSettings[Setting],
) => void;
