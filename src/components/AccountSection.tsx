import { useState, type ChangeEvent } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AccountInput, StatesProps } from "@/types/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Trash2Icon } from "lucide-react";

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
  const [ProfileError, setProfileError] = useState("");
  const [ProfileSuccess, setProfileSuccess] = useState<boolean>(false);

  function updateFeilds(fields: Partial<AccountInput>) {
    setAccountInput((prev) => ({ ...prev, ...fields }));
  }

  function SetStates({ success, msg }: StatesProps) {
    setIsSaving(msg ? false : !success);
    setProfileSuccess(success);
    setProfileError(!success ? msg : "");

    setTimeout(() => {
      setProfileSuccess(false);
      setProfileError("");
    }, 3000);
  }

  function validateDisplayName() {
    return (
      AccountInput.displayName.trim().length >= 2 &&
      AccountInput.displayName.trim().length <= 50
    );
  }

  async function handleEdit() {
    if (IsSaving) return;
    SetStates({ success: false, msg: "" });

    if (
      AccountInput.displayName.trim() !==
      session.user.user_metadata.display_name.trim()
    ) {
      if (!validateDisplayName())
        return SetStates({
          success: false,
          msg: "Display name must be different and between 2 and 50 characters.",
        });

      const DisplayNameOK = await updateDisplayName(AccountInput.displayName);

      if (!DisplayNameOK)
        return SetStates({
          success: false,
          msg: "Failed to update display name.",
        });
    }

    if (AccountInput.profilePicture) {
      const ProfilePictureOK = await updateProfilePicture(
        AccountInput.profilePicture,
      );

      if (!ProfilePictureOK)
        return SetStates({
          success: false,
          msg: "Failed to update profile picture.",
        });
    }

    SetStates({ success: true });
  }

  async function handleDeleteProfilePicture() {
    if (IsSaving) return;
    SetStates({ success: false, msg: "" });

    const ok = await deleteProfilePicture(session.user.id);
    if (!ok)
      return SetStates({
        success: false,
        msg: "Failed to delete profile picture.",
      });

    SetStates({ success: true });
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
    <Card className='settings-section'>
      <CardHeader className='settings-section-title'>
        <CardTitle className='font-extrabold text-[1.25rem]'>Account</CardTitle>
        <CardDescription>
          Update your display name and profile picture.
        </CardDescription>
      </CardHeader>

      <CardContent className='flex gap-8 items-start mb-8'>
        <div className='flex flex-col gap-4 items-center'>
          <div
            className={`w-25 h-25 rounded-full flex items-center justify-center overflow-hidden border-[3px] border-(--navy) ${
              AccountInput.profilePicture
                ? "bg-transparent"
                : "bg-(--navy-light)"
            }`}
          >
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

        <Card className='flex-1 p-5! m-0! bg-transparent! ring-0!'>
          <FieldSet>
            <FieldGroup className='gap-5!'>
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
            </FieldGroup>
            <FieldGroup>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input
                id='email'
                type='email'
                value={session.user.email || ""}
                disabled
                className='disabled:cursor-not-allowed!'
              />
              <FieldDescription>Your login email address.</FieldDescription>
            </FieldGroup>
          </FieldSet>
        </Card>
      </CardContent>
      <Button
        type='button'
        onClick={handleEdit}
        className='w-full p-5 text-[20px]'
        disabled={IsSaving}
      >
        {IsSaving ? "Saving..." : "Submit Edits"}
      </Button>
      {(ProfileError || ProfileSuccess) && (
        <Card className='p-0! m-0! bg-transparent! ring-0!'>
          {ProfileSuccess && (
            <CardHeader className='p-0! m-0! bg-transparent! ring-0!'>
              <CardTitle className='text-lg text-(--success) bg-green-500/20 px-3 py-1 rounded-lg w-full text-center'>
                Profile updated successfully!
              </CardTitle>
            </CardHeader>
          )}
          {ProfileError && (
            <CardHeader className='p-0! m-0! bg-transparent! ring-0!'>
              <CardTitle className='text-lg text-destructive bg-red-500/20 px-3 py-1 rounded-lg w-full text-center'>
                {ProfileError}
              </CardTitle>
            </CardHeader>
          )}
        </Card>
      )}
    </Card>
  );
}
