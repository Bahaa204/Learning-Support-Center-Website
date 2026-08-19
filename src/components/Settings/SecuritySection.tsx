import { LockKeyholeIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import PasswordInput from "../PasswordInput";
import type { PasswordInput as PasswordInputType } from "@/types/settings";
import { useState, type SubmitEvent } from "react";
import { Button } from "../ui/button";

type SecuritySectionProps = {
  UpdatePassword: (newPassword: string) => Promise<boolean>;
};

export default function SecuritySection({
  UpdatePassword,
}: SecuritySectionProps) {
  const InitailInput: PasswordInputType = {
    newPassword: "",
    confirmNewPassword: "",
  };
  const [InputPassword, setInputPassword] =
    useState<PasswordInputType>(InitailInput);
  const [PasswordError, setPasswordError] = useState<string>("");

  function SetError(error: string) {
    setPasswordError(error);

    setTimeout(() => {
      setPasswordError("");
    }, 3 * 1000 /* 3 seconds */);
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
    SetError("");

    if (!InputPassword.newPassword || !InputPassword.confirmNewPassword)
      return SetError("Both password fields are required.");

    if (InputPassword.newPassword !== InputPassword.confirmNewPassword)
      return SetError("New password and confirmation do not match.");

    await UpdatePassword(InputPassword.newPassword);

    setInputPassword(InitailInput);
  }

  return (
    <Card className='settings-section'>
      <CardHeader className='settings-section-title flex items-center gap-4 pl-0'>
        <LockKeyholeIcon size={30} />
        <div className='flex flex-col'>
          <CardTitle className='font-extrabold text-[1.25rem] flex items-center gap-2'>
            Security
          </CardTitle>
          <CardDescription>
            Change your password to enhance account security. Make sure to
            choose a strong and unique password.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='p-0!'>
        <form onSubmit={handleSubmitPassword} id='password-form'>
          <FieldSet>
            <FieldGroup>
              <FieldLabel htmlFor='newPassword'>New Password</FieldLabel>
              <PasswordInput
                id='newPassword'
                value={InputPassword.newPassword}
                onChange={(e) => updateFields({ newPassword: e.target.value })}
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
            <Button type='submit' className='btn-primary text-[18px]'>
              Change Password
            </Button>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
