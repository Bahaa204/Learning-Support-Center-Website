import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSettings } from "@/hooks/useSettings";
import AccountSection from "@/components/AccountSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import type {
  PasswordInput as PasswordInputType,
  SettingsExportFormat,
  SettingsFontSize,
  SettingsPageSize,
  SettingsTheme,
  StatesProps,
} from "@/types/settings";
import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router-dom";
import PasswordInput from "@/components/PasswordInput";
import ErrorCard from "@/components/error-card";
import LoadingCard from "@/components/loading-card";
import { simplifyErrorMessage } from "@/helper/functions";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function Settings() {
  useDocumentTitle("Settings");

  const {
    Session,
    Loading: AuthLoading,
    Error: AuthError,
    SignOut,
    UpdateDisplayName,
    UpdatePassword,
    UpdateProfilePicture,
  } = useAuth();

  const { Settings, updateSetting } = useSettings();

  const InitailInput: PasswordInputType = {
    newPassword: "",
    confirmNewPassword: "",
  };
  const [InputPassword, setInputPassword] =
    useState<PasswordInputType>(InitailInput);
  const [IsChanging, setIsChanging] = useState(false);
  const [PasswordError, setPasswordError] = useState("");
  const [PasswordSuccess, setPasswordSuccess] = useState<boolean>();

  function SetStates({ success, msg }: StatesProps) {
    setIsChanging(msg ? false : !success);
    setPasswordSuccess(success);
    setPasswordError(!success ? msg : "");

    setTimeout(() => {
      setPasswordSuccess(false);
      // setPasswordError("");
    }, 3000);
  }

  function updateFields(fields: Partial<PasswordInputType>) {
    setInputPassword((prev) => ({ ...prev, ...fields }));
  }

  function AriaValididateError() {
    return (
      PasswordError.includes("required") ||
      PasswordError.includes("do not match")
    );
  }

  async function handleSubmitPassword(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (IsChanging) return;
    setIsChanging(true);
    setPasswordError("");

    if (!InputPassword.newPassword || !InputPassword.confirmNewPassword)
      return SetStates({
        success: false,
        msg: "All password fields are required.",
      });

    if (InputPassword.newPassword !== InputPassword.confirmNewPassword)
      return SetStates({
        success: false,
        msg: "New password and confirmation do not match.",
      });

    const ok = await UpdatePassword(InputPassword.newPassword);

    setIsChanging(false);

    if (!ok)
      return SetStates({ success: false, msg: "Failed to update password." });

    SetStates({ success: true });
    setInputPassword(InitailInput);
  }

  if (AuthLoading) {
    return <LoadingCard message='Checking authentication' />;
  }

  if (AuthError) {
    return <ErrorCard error={simplifyErrorMessage(AuthError)} />;
  }

  if (!Session) {
    return <Navigate to='/login' />;
  }

  return (
    <>
      <h1 className='page-title'>Settings</h1>

      <div className='settings-container'>
        <AccountSection
          session={Session}
          updateDisplayName={UpdateDisplayName}
          updateProfilePicture={UpdateProfilePicture}
        />

        <Card className='settings-section'>
          <form onSubmit={handleSubmitPassword}>
            <FieldSet>
              <FieldGroup>
                <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
                <PasswordInput
                  id='newPassword'
                  value={InputPassword.newPassword}
                  onChange={(e) =>
                    updateFields({ newPassword: e.target.value })
                  }
                  placeholder='Enter your new password'
                  aria-invalid={AriaValididateError()}
                />
                <FieldDescription>
                  The new password must be at least 8 characters long and
                  different from your current password.
                </FieldDescription>
                {PasswordError && (
                  <FieldError className='text-lg text-destructive bg-red-500/20 px-3 py-1 rounded-lg w-full text-center'>
                    {PasswordError}
                  </FieldError>
                )}
              </FieldGroup>
              <FieldGroup>
                <FieldLabel htmlFor='confirmPassword'>
                  Confirm New Password
                </FieldLabel>
                <PasswordInput
                  id='confirmPassword'
                  value={InputPassword.confirmNewPassword}
                  onChange={(e) =>
                    updateFields({ confirmNewPassword: e.target.value })
                  }
                  placeholder='Confirm your new password'
                  aria-invalid={AriaValididateError()}
                />
                <FieldDescription>
                  Please re-enter your new password for confirmation.
                </FieldDescription>
                {PasswordError && (
                  <FieldError className='text-lg text-destructive bg-red-500/20 px-3 py-1 rounded-lg w-full text-center'>
                    {PasswordError}
                  </FieldError>
                )}
              </FieldGroup>
              <Button type='submit' disabled={IsChanging}>
                {IsChanging ? "Updating..." : "Change Password"}
              </Button>
            </FieldSet>
            {PasswordSuccess && (
              <Card className='p-0! m-0! bg-transparent! ring-0! mt-4!'>
                <CardHeader className='ring-0! bg-green-500/20 text-center text-(--success) p-3! m-0! rounded-lg!'>
                  <CardTitle>Password Updated</CardTitle>
                  <CardDescription>
                    Your password has been updated successfully.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </form>
        </Card>

        <Card className='settings-section'>
        <CardHeader className='settings-section-title border-b-0!'>
            <CardTitle className='font-extrabold text-[1.25rem]'>
              Log Out
            </CardTitle>
            <CardDescription>
              Log out of your account on all devices.
            </CardDescription>
          </CardHeader>
          <Button variant='destructive' onClick={async () => await SignOut()}>
            Sign Out
          </Button>
        </Card>

        {/* Appearance Section */}
        <Card className='settings-section'>
          <CardHeader className='settings-section-title'>
            <CardTitle className='font-extrabold text-[1.25rem]'>
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application to your preference.
              Changes will be saved automatically.
            </CardDescription>
          </CardHeader>

          <FieldSet>
            <FieldGroup>
              <FieldLabel>Theme</FieldLabel>
              <RadioGroup
                value={Settings.theme}
                onValueChange={(value) =>
                  updateSetting("theme", value as SettingsTheme)
                }
              >
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='light' id='light-theme' />
                  <Label htmlFor='light-theme' className='cursor-pointer'>
                    Light
                  </Label>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='dark' id='dark-theme' />
                  <Label htmlFor='dark-theme' className='cursor-pointer'>
                    Dark
                  </Label>
                </div>
              </RadioGroup>
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Font Size</FieldLabel>
              <RadioGroup
                value={Settings.fontSize}
                onValueChange={(value) =>
                  updateSetting("fontSize", value as SettingsFontSize)
                }
              >
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='normal' id='normal-font' />
                  <Label htmlFor='normal-font' className='cursor-pointer'>
                    Normal
                  </Label>
                </div>
                <div className='flex items-center gap-3'>
                  <RadioGroupItem value='large' id='large-font' />
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
                  checked={Settings.compactMode}
                  onCheckedChange={(checked) =>
                    updateSetting("compactMode", checked as boolean)
                  }
                />
                <FieldLabel htmlFor='compactMode'>
                  Compact Mode - Reduce spacing in tables and forms
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Card>

        {/* Data and Records Section */}
        <Card className='settings-section'>
          <CardHeader className='settings-section-title'>
            <CardTitle className='font-extrabold text-[1.25rem]'>
              Data & Records
            </CardTitle>
            <CardDescription>
              Configure how data is displayed, exported, and retained in the
              application. Changes will be saved automatically.
            </CardDescription>
          </CardHeader>

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='pageSize'>Default Page Size</FieldLabel>
                <Select
                  value={String(Settings.pageSize)}
                  onValueChange={(value) =>
                    updateSetting("pageSize", Number(value) as SettingsPageSize)
                  }
                >
                  <SelectTrigger id='pageSize'>
                    <SelectValue placeholder='Select page size' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='5'>5 records per page</SelectItem>
                    <SelectItem value='10'>10 records per page</SelectItem>
                    <SelectItem value='25'>25 records per page</SelectItem>
                    <SelectItem value='50'>50 records per page</SelectItem>
                    <SelectItem value='100'>100 records per page</SelectItem>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Number of records shown per page in tables.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel>Export Format</FieldLabel>
                <RadioGroup
                  value={Settings.exportFormat}
                  onValueChange={(value) =>
                    updateSetting("exportFormat", value as SettingsExportFormat)
                  }
                >
                  <div className='flex items-center gap-3'>
                    <RadioGroupItem value='csv' id='csv-export' />
                    <Label htmlFor='csv-export' className='cursor-pointer'>
                      CSV
                    </Label>
                  </div>
                  <div className='flex items-center gap-3'>
                    <RadioGroupItem value='excel' id='excel-export' />
                    <Label htmlFor='excel-export' className='cursor-pointer'>
                      Excel
                    </Label>
                  </div>
                </RadioGroup>
                <FieldDescription>
                  Default format for exporting records.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor='archiveRetention'>
                  Archive Retention
                </FieldLabel>
                <Input
                  id='archiveRetention'
                  type='number'
                  min='30'
                  max='730'
                  step='30'
                  value={Settings.archiveRetention}
                  onChange={(e) =>
                    updateSetting("archiveRetention", Number(e.target.value))
                  }
                />
                <FieldDescription>
                  Days to keep archived records before deletion (
                  {Settings.archiveRetention} days).
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </Card>
      </div>
    </>
  );
}
