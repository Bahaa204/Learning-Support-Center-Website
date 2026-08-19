import { Monitor } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import type {
  SettingsFontSize,
  SettingsTheme,
  UpdateSettingsFunction,
} from "@/types/settings";

type AppearanceSectionProps = {
  Theme: SettingsTheme;
  FontSize: SettingsFontSize;
  CompactMode: boolean;
  UpdateSetting: UpdateSettingsFunction;
};

export default function AppearanceSection({
  Theme,
  FontSize,
  CompactMode,
  UpdateSetting,
}: AppearanceSectionProps) {
  return (
    <Card className='settings-section' id='appearance'>
      <CardHeader className='settings-section-title flex items-center gap-4 pl-0'>
        <Monitor size={30} />
        <div className='flex flex-col'>
          <CardTitle className='font-extrabold text-[1.25rem]'>
            Appearance
          </CardTitle>
          <CardDescription>
            Customize the look and feel of the application to your preference.
            Changes will be saved automatically.
          </CardDescription>
        </div>
      </CardHeader>

      <FieldSet>
        <FieldGroup>
          <FieldLabel>Theme</FieldLabel>
          <RadioGroup
            value={Theme}
            onValueChange={(value) =>
              UpdateSetting("theme", value as SettingsTheme)
            }
          >
            <div className='flex items-center gap-3'>
              <RadioGroupItem
                value='light'
                id='light-theme'
                className={`${Theme === "light" ? "btn-primary" : ""}`}
              />
              <Label htmlFor='light-theme' className='cursor-pointer'>
                Light
              </Label>
            </div>
            <div className='flex items-center gap-3'>
              <RadioGroupItem
                value='dark'
                id='dark-theme'
                className={`${Theme === "dark" ? "btn-primary" : ""}`}
              />
              <Label htmlFor='dark-theme' className='cursor-pointer'>
                Dark
              </Label>
            </div>
          </RadioGroup>
        </FieldGroup>

        <FieldGroup>
          <FieldLabel>Font Size</FieldLabel>
          <RadioGroup
            value={FontSize}
            onValueChange={(value) =>
              UpdateSetting("fontSize", value as SettingsFontSize)
            }
          >
            <div className='flex items-center gap-3'>
              <RadioGroupItem
                value='normal'
                id='normal-font'
                className={`${FontSize === "normal" ? "btn-primary" : ""}`}
              />
              <Label htmlFor='normal-font' className='cursor-pointer'>
                Normal
              </Label>
            </div>
            <div className='flex items-center gap-3'>
              <RadioGroupItem
                value='large'
                id='large-font'
                className={`${FontSize === "large" ? "btn-primary" : ""}`}
              />
              <Label htmlFor='large-font' className='cursor-pointer'>
                Large
              </Label>
            </div>
          </RadioGroup>
        </FieldGroup>

        <FieldGroup>
          <Field orientation='horizontal'>
            <Checkbox
              id='compactMode'
              name='compactMode'
              checked={CompactMode}
              onCheckedChange={(checked) =>
                UpdateSetting("compactMode", checked as boolean)
              }
              className={`${CompactMode ? "btn-primary" : ""}`}
            />
            <FieldLabel htmlFor='compactMode'>
              Compact Mode - Reduce spacing in betweem elements and tables for a
              denser layout.
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  );
}
