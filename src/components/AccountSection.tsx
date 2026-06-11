import { useState, type ChangeEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountSectionProps = {
  session: Session;
  updateDisplayName: (displayName: string) => Promise<boolean>;
  updateProfilePicture: (file: File) => Promise<boolean>;
};

export default function AccountSection({
  session,
  updateDisplayName,
  updateProfilePicture,
}: AccountSectionProps) {
  const [displayName, setDisplayName] = useState(
    session.user.user_metadata?.display_name || "",
  );
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function handleSaveProfile() {
    if (isSaving) return;
    setIsSaving(true);
    setSaveMessage("");

    if (
      displayName &&
      displayName !== session.user.user_metadata?.display_name
    ) {
      const displaynameOK = await updateDisplayName(displayName);
      if (!displaynameOK) {
        setSaveMessage("Error: Failed to update display name.");
        setIsSaving(false);
        return;
      }
    }

    if (!profilePicture) {
      setSaveMessage("Please select a profile picture to upload.");
      setIsSaving(false);
      return;
    }

    const profilePictureOK = await updateProfilePicture(profilePicture);

    if (!profilePictureOK) {
      setSaveMessage("Error: Failed to update profile picture.");
      setIsSaving(false);
      return;
    }

    setSaveMessage("Profile updated successfully!");
    setTimeout(() => setSaveMessage(""), 3000);
    setIsSaving(false);
  }

  function handleProfilePictureChange(event: ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0)
      setProfilePicture(event.target.files[0]);
  }

  return (
    <section className='settings-section'>
      <h2 className='settings-section-title'>Account</h2>

      <div className='flex gap-8 items-start mb-8'>
        <div className='flex flex-col gap-4 items-center'>
          <div
            className={`w-25 h-25 rounded-full flex items-center justify-center overflow-hidden border-[3px] border-(--navy) ${
              profilePicture ? "bg-transparent" : "bg-(--navy-light)"
            }`}
          >
            {session.user.user_metadata?.avatar_url ? (
              <img
                src={session.user.user_metadata?.avatar_url || ""}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            ) : (
              <svg
                width='60'
                height='60'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                className='text-(--gold)'
              >
                <circle cx='12' cy='8' r='4' />
                <path d='M4 20c0-4 3.5-7 8-7s8 3 8 7' />
              </svg>
            )}
          </div>
          <input
            type='file'
            accept='image/*'
            onChange={handleProfilePictureChange}
            className='profile-picture-input'
          />
        </div>

        <div className='flex-1'>
          <FieldGroup>
            <div>
              <Label htmlFor='displayName'>Display Name</Label>
              <Input
                id='displayName'
                type='text'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder='Your display name'
              />
            </div>

            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                defaultValue={session.user.email || ""}
                disabled
              />
              <p className='text-sm text-muted-foreground'>
                Your login email address.
              </p>
            </div>
          </FieldGroup>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <Button onClick={handleSaveProfile} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
        {saveMessage && (
          <p
            className={`text-sm ${
              saveMessage.startsWith("Error")
                ? "text-destructive"
                : "text-(--success)"
            }`}
          >
            {saveMessage}
          </p>
        )}
      </div>
    </section>
  );
}
