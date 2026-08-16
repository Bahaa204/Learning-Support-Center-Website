import { useState, type ChangeEvent } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AccountInput } from "@/types/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Trash2Icon } from "lucide-react";
import { validateDisplayName, validateFileSize } from "@/helper/validation";

type AccountSectionProps = {
  session: Session;
  updateDisplayName: (displayName: string) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<boolean>;
  deleteProfilePicture: (userId: User["id"]) => Promise<boolean>;
};

export default function AccountSection({
  session,
  updateDisplayName,
  updateProfilePicture,
  deleteProfilePicture,
}: AccountSectionProps) {
  const InitialInput: AccountInput = {
    displayName: session.user.user_metadata?.display_name || "",
    profilePicture: null,
  };

  const [AccountInput, setAccountInput] = useState<AccountInput>(InitialInput);
  const [IsSaving, setIsSaving] = useState(false);
  const [ProfileError, setProfileError] = useState<string>("");

  function updateFeilds(fields: Partial<AccountInput>) {
    setAccountInput((prev) => ({ ...prev, ...fields }));
  }

  function SetStates(saving: boolean, error: string) {
    setIsSaving(saving);
    setProfileError(error);

    setTimeout(() => {
      setProfileError("");
    }, 3 * 1000 /* 3 seconds */);
  }

  async function handleEdit() {
    if (IsSaving) return;
    SetStates(true, "");

    if (!validateDisplayName(AccountInput.displayName))
      return SetStates(
        false,
        "Display name must be between 3 and 50 characters.",
      );

    if (
      !AccountInput.profilePicture ||
      !validateFileSize(AccountInput.profilePicture)
    )
      return SetStates(
        false,
        "Invalid profile picture or it exceeds the file size limit.",
      );

    await updateDisplayName(AccountInput.displayName);

    await updateProfilePicture(AccountInput.profilePicture);

    SetStates(true, "");
  }

  async function handleDeleteProfilePicture() {
    if (IsSaving) return;
    setIsSaving(true);

    const ok = await deleteProfilePicture(session.user.id);
    if (!ok) return setProfileError("Failed to delete profile picture.");

    setProfileError("");
  }

  function handleProfilePictureChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0)
      updateFeilds({ profilePicture: event.target.files[0] });
  }

  const email = session.user.email;

  const DisplayName: string =
    session?.user.user_metadata?.display_name?.trim() ||
    email?.slice(0, email.indexOf("@")) ||
    "";

  const initials =
    DisplayName.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "";

  return (
    <Card className='settings-section' id="account">
      <CardHeader className='settings-section-title'>
        <CardTitle className='font-extrabold text-[1.25rem]'>Account</CardTitle>
        <CardDescription>
          Update your display name and profile picture.
        </CardDescription>
      </CardHeader>

      <CardContent className='flex flex-wrap gap-8 items-start'>
        <div className='flex flex-col gap-8 items-center'>
          <div className='w-25 h-25 rounded-full flex items-center justify-center overflow-hidden border-[3px] border-(--navy) bg-(--navy-light)'>
            {session.user.user_metadata?.avatar_url ? (
              <img
                src={session.user.user_metadata?.avatar_url}
                alt='Profile'
                className='w-full h-full rounded-full object-cover'
              />
            ) : (
              <span className='text-(--gold-light) text-5xl font-semibold text-center'>
                {initials}
              </span>
            )}
          </div>
          <Input
            type='file'
            accept='image/*'
            onChange={handleProfilePictureChange}
            className='profile-picture-input'
            disabled={IsSaving}
          />
          <Button
            type='button'
            disabled={IsSaving}
            variant='destructive'
            className='w-full text-[16px]'
            onClick={handleDeleteProfilePicture}
          >
            {IsSaving ? (
              "Deleting..."
            ) : (
              <>
                <Trash2Icon /> Delete Profile Picture
              </>
            )}
          </Button>
        </div>

        <FieldSet>
          <Field className='gap-5!'>
            <FieldLabel htmlFor='displayName' className='p-0! m-0!'>
              Display Name
            </FieldLabel>
            <Input
              id='displayName'
              type='text'
              value={AccountInput.displayName}
              onChange={(event) =>
                updateFeilds({ displayName: event.target.value })
              }
              placeholder='Your display name'
              disabled={IsSaving}
              className='disabled:cursor-not-allowed'
            />
            <FieldDescription>
              the name that will be shown to other users.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input
              id='email'
              type='email'
              value={session.user.email || ""}
              disabled
              className='disabled:cursor-not-allowed!'
            />
            <FieldDescription>Your login email address.</FieldDescription>
          </Field>
        </FieldSet>
      </CardContent>
      <Button
        type='button'
        onClick={handleEdit}
        className='w-full p-5 text-[20px] btn-primary'
        disabled={IsSaving}
      >
        {IsSaving ? "Saving..." : "Submit Edits"}
      </Button>
      {ProfileError && (
        <div className='text-lg text-destructive bg-red-500/20 px-3 py-1 rounded-lg w-full text-center'>
          {ProfileError}
        </div>
      )}
    </Card>
  );
}
