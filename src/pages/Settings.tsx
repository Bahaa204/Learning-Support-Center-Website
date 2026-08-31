import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSettings } from "@/hooks/useSettings";
import AccountSection from "@/components/Settings/AccountSection";
import ErrorCard from "@/components/error-card";
import LoadingCard from "@/components/loading-card";
import { SetErrorMessage } from "@/helper/errorhelpers";
import SecuritySection from "@/components/Settings/SecuritySection";
import AppearanceSection from "@/components/Settings/AppearanceSection";
import DataAndRecordsSection from "@/components/Settings/DataAndRecordsSection";
import DangerZone from "@/components/Settings/DangerZone";
import NavigateToLogin from "@/components/NavigateToLogin";
import { useUsers } from "@/hooks/useUsers";

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
    DeleteProfilePicture,
    DeleteUser,
    RegisterPasskey,
    DeletePasskeys,
  } = useAuth();

  const { Settings, updateSetting } = useSettings();
  const { UpdateUser } = useUsers(Session?.user, false);

  async function handleUpdateUserName(display_name: string) {
    if (!Session) return false;

    const updatedUser = await UpdateUser(Session.user.id, { display_name });
    return updatedUser !== null;
  }

  if (AuthLoading) {
    return <LoadingCard message="Checking authentication" />;
  }

  if (AuthError) return <ErrorCard message={SetErrorMessage(AuthError)} />;

  if (!Session) {
    return <NavigateToLogin />;
  }

  async function handleDeleteAccount() {
    if (!Session) return;
    const ok = await DeleteUser(Session.user.id);
    if (ok) await SignOut();
  }

  return (
    <>
      <h1 className="page-title">Settings</h1>

      <div className="settings-container">
        <AccountSection
          session={Session}
          updateDisplayName={UpdateDisplayName}
          updateProfilePicture={UpdateProfilePicture}
          deleteProfilePicture={DeleteProfilePicture}
          updateUserName={handleUpdateUserName}
        />

        <SecuritySection
          UpdatePassword={UpdatePassword}
          RegisterPasskey={RegisterPasskey}
        />

        {/* Appearance Section */}
        <AppearanceSection
          Theme={Settings.theme}
          FontSize={Settings.fontSize}
          CompactMode={Settings.compactMode}
          UpdateSetting={updateSetting}
        />

        {/* Data and Records Section */}
        <DataAndRecordsSection
          PageSize={Settings.pageSize}
          ExportFormat={Settings.exportFormat}
          ArchiveRetention={Settings.archiveRetention}
          UpdateSetting={updateSetting}
        />

        <DangerZone
          LogOut={async () => await SignOut()}
          DeleteAccount={handleDeleteAccount}
          DeletePasskeys={DeletePasskeys}
        />
      </div>
    </>
  );
}
