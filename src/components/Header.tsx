import { useState } from "react";
import RHULogo from "/Images/rhu_logo.png";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";
import {
  DatabaseIcon,
  LockKeyholeIcon,
  LogOutIcon,
  Monitor,
  SettingsIcon,
  UserCircleIcon,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "./ui/button";
import type {
  SettingsExportFormat,
  SettingsFontSize,
  SettingsPageSize,
  SettingsTheme,
} from "@/types/settings";

type HeaderProps = {
  onToggleMenu: () => void;
  isMenuOpen: boolean;
};

export default function Header({ onToggleMenu, isMenuOpen }: HeaderProps) {
  const { Session, SignOut, Loading: AuthLoading } = useAuth();
  const { Settings, updateSetting } = useSettings();

  const [ShowLogoutNotice, setShowLogoutNotice] = useState<string>("");
  async function LogOut() {
    setShowLogoutNotice("Logging Out...");
    const ok = await SignOut();
    if (ok) {
      setShowLogoutNotice("Logged out successfully");
      setTimeout(() => {
        setShowLogoutNotice("");
      }, 2500);
    }
  }

  const email = Session?.user.email;

  const DisplayName: string =
    Session?.user.user_metadata?.display_name?.trim() ||
    email?.slice(0, email.indexOf("@")) ||
    "";

  const initials =
    DisplayName.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "";

  return (
    <>
      {ShowLogoutNotice && (
        <div className='fixed top-4 right-4 z-9999 rounded-md border border-emerald-200 bg-emerald-50/90 px-4 py-2 text-sm font-medium text-emerald-700 shadow-lg'>
          {ShowLogoutNotice}
        </div>
      )}
      <header className='site-header'>
        {Session && (
          <Button
            type='button'
            className='hamburger-menu'
            onClick={onToggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <line x1='4' y1='6' x2='20' y2='6' />
              <line x1='4' y1='12' x2='20' y2='12' />
              <line x1='4' y1='18' x2='20' y2='18' />
            </svg>
          </Button>
        )}
        <div className='header-brand relative'>
          <Link to='/'>
            <img src={RHULogo} alt='RHU Logo' className='header-logo' />
          </Link>
        </div>
        {Session && (
          <div className='header-user'>
            <div className='user-name'>{DisplayName}</div>

            {Session && (
              <DropdownMenu>
                <DropdownMenuTrigger className='cursor-pointer bg-(--navy) rounded-4xl border-2 z-99999 border-(--gold)'>
                  <div className='size-9 flex items-center justify-center relative text-center'>
                    <span className='text-(--gold-light) text-[0.72rem] font-semibold text-center'>
                      {Session.user.user_metadata?.avatar_url ? (
                        <img
                          src={Session.user.user_metadata.avatar_url}
                          alt='Profile'
                          className='w-full h-full rounded-full object-cover'
                        />
                      ) : (
                        initials
                      )}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='w-full z-99999'>
                  {AuthLoading ? (
                    <DropdownMenuItem>
                      Checking Authentication...
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>
                          Account Information
                        </DropdownMenuLabel>
                        <DropdownMenuItem>
                          Display Name:{" "}
                          {Session.user.user_metadata.display_name || "N/A"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Email: {Session.user.email}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className='flex gap-2 w-full'>
                            <SettingsIcon />
                            Settings
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent>
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Settings</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link to='/settings' className='flex gap-2 w-full'>
                                  <UserCircleIcon /> Account
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link to='/settings' className='flex gap-2 w-full'>
                                  <LockKeyholeIcon /> Security
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className='flex gap-2 w-full'>
                                  <Monitor /> Appearance
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                      value={Settings.theme}
                                      onValueChange={(value) =>
                                        updateSetting(
                                          "theme",
                                          value as SettingsTheme,
                                        )
                                      }
                                    >
                                      <DropdownMenuRadioItem value='light'>
                                        Light
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value='dark'>
                                        Dark
                                      </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                  </DropdownMenuGroup>
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                      Font Size
                                    </DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                      value={Settings.fontSize}
                                      onValueChange={(value) =>
                                        updateSetting(
                                          "fontSize",
                                          value as SettingsFontSize,
                                        )
                                      }
                                    >
                                      <DropdownMenuRadioItem value='normal'>
                                        Normal
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value='large'>
                                        Large
                                      </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                  </DropdownMenuGroup>
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                      Compact Mode
                                    </DropdownMenuLabel>
                                    <DropdownMenuCheckboxItem
                                      checked={Settings.compactMode}
                                      onCheckedChange={(checked) =>
                                        updateSetting("compactMode", checked)
                                      }
                                    >
                                      Compact Mode
                                    </DropdownMenuCheckboxItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className='flex gap-2 w-full'>
                                  <DatabaseIcon /> Data and Records
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                      Page Size
                                    </DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                      value={String(Settings.pageSize)}
                                      onValueChange={(value) =>
                                        updateSetting(
                                          "pageSize",
                                          Number(value) as SettingsPageSize,
                                        )
                                      }
                                    >
                                      <DropdownMenuRadioItem value='5'>
                                        5 records per page
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value='10'>
                                        10 records per page
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value='25'>
                                        25 records per page
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value='50'>
                                        50 records per page
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value='100'>
                                        100 records per page
                                      </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                  </DropdownMenuGroup>
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel>
                                      Export Format
                                    </DropdownMenuLabel>
                                    <DropdownMenuRadioGroup
                                      value={Settings.exportFormat}
                                      onValueChange={(value) =>
                                        updateSetting(
                                          "exportFormat",
                                          value as SettingsExportFormat,
                                        )
                                      }
                                    >
                                      <DropdownMenuRadioItem value='csv'>
                                        CSV
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value='excel'>
                                        Excel
                                      </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                  </DropdownMenuGroup>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            </DropdownMenuGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Log Out</DropdownMenuLabel>
                        <DropdownMenuItem
                          variant='destructive'
                          onClick={LogOut}
                          className='cursor-pointer'
                        >
                          <LogOutIcon /> Log out
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </header>
    </>
  );
}
