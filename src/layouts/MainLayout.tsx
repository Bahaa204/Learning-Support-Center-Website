import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import WarningDialog from "@/components/WarningDialog";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import type {
  SettingsExportFormat,
  SettingsFontSize,
  SettingsPageSize,
  SettingsTheme,
} from "@/types/settings";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import {
  ArrowBigLeftIcon,
  ArrowBigRightIcon,
  BugIcon,
  DatabaseIcon,
  LockKeyholeIcon,
  LogOutIcon,
  Monitor,
  RefreshCw,
  SettingsIcon,
  UserCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { Session, Loading, SignOut } = useAuth();
  const { Settings, updateSetting } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [ShowWarningDialog, setShowWarningDialog] = useState<boolean>(false);

  useEffect(() => {
    if (!Session) return;
    const warningDialogShown = sessionStorage.getItem("devwarningDialogShown");

    if (!warningDialogShown) {
      setShowWarningDialog(true);
      sessionStorage.setItem("devwarningDialogShown", "true");
    }
  }, [Session]);

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild disabled={Loading}>
          <div className="app-shell">
            <Header
              onToggleMenu={() =>
                setIsMenuOpen((currentValue) => !currentValue)
              }
              isMenuOpen={isMenuOpen}
            />
            <div className="layout">
              {Session && (
                <>
                  <SideBar
                    onNavigate={() => setIsMenuOpen(false)}
                    isOpen={isMenuOpen}
                    Session={Session}
                    location={location}
                  />
                  {isMenuOpen && (
                    <button
                      className="sidebar-overlay"
                      onClick={() => setIsMenuOpen(false)}
                      aria-label="Close menu"
                      type="button"
                    />
                  )}
                </>
              )}
              <main className="main">
                <Outlet />
              </main>
            </div>
            <Footer />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="z-100000">
          <ContextMenuGroup>
            <ContextMenuLabel>Navigation</ContextMenuLabel>
            <ContextMenuItem
              className="cursor-pointer flex items-center gap-2 w-full"
              onClick={() => navigate(-1)}
            >
              <ArrowBigLeftIcon /> Back
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer flex items-center gap-2 w-full"
              onClick={() => navigate(+1)}
            >
              Forward <ArrowBigRightIcon />
            </ContextMenuItem>
            <ContextMenuItem
              className="cursor-pointer flex items-center gap-2 w-full"
              onClick={() => window.location.reload()}
            >
              <RefreshCw /> Refresh
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuLabel>Settings</ContextMenuLabel>
            <ContextMenuSubTrigger className="flex items-center gap-2 w-full">
              <SettingsIcon /> Settings
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuLabel>Settings</ContextMenuLabel>
                <ContextMenuItem>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 w-full"
                  >
                    <UserCircleIcon /> Account
                  </Link>
                </ContextMenuItem>
                <ContextMenuItem>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 w-full"
                  >
                    <LockKeyholeIcon /> Security
                  </Link>
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger className="flex items-center gap-2 w-full">
                    <Monitor /> Appearance
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuGroup>
                      <ContextMenuLabel>Theme</ContextMenuLabel>
                      <ContextMenuRadioGroup
                        value={Settings.theme}
                        onValueChange={(value) =>
                          updateSetting("theme", value as SettingsTheme)
                        }
                      >
                        <ContextMenuRadioItem
                          value="light"
                          className="cursor-pointer"
                        >
                          Light
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem
                          value="dark"
                          className="cursor-pointer"
                        >
                          Dark
                        </ContextMenuRadioItem>
                      </ContextMenuRadioGroup>
                    </ContextMenuGroup>
                    <ContextMenuGroup>
                      <ContextMenuLabel>Font Size</ContextMenuLabel>
                      <ContextMenuRadioGroup
                        value={Settings.fontSize}
                        onValueChange={(value) =>
                          updateSetting("fontSize", value as SettingsFontSize)
                        }
                      >
                        <ContextMenuRadioItem
                          value="normal"
                          className="cursor-pointer"
                        >
                          Normal
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem
                          value="large"
                          className="cursor-pointer"
                        >
                          Large
                        </ContextMenuRadioItem>
                      </ContextMenuRadioGroup>
                    </ContextMenuGroup>
                    <ContextMenuGroup>
                      <ContextMenuLabel>Compact Mode</ContextMenuLabel>
                      <ContextMenuCheckboxItem
                        checked={Settings.compactMode}
                        onCheckedChange={(checked) =>
                          updateSetting("compactMode", checked)
                        }
                        className="cursor-pointer"
                      >
                        Compact Mode
                      </ContextMenuCheckboxItem>
                    </ContextMenuGroup>
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSub>
                  <ContextMenuSubTrigger className="flex items-center gap-2 w-full">
                    <DatabaseIcon /> Data and Records
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    <ContextMenuGroup>
                      <ContextMenuLabel>Page Size</ContextMenuLabel>
                      <ContextMenuRadioGroup
                        value={String(Settings.pageSize)}
                        onValueChange={(value) =>
                          updateSetting(
                            "pageSize",
                            Number(value) as SettingsPageSize,
                          )
                        }
                      >
                        <ContextMenuRadioItem
                          value="5"
                          className="cursor-pointer"
                        >
                          5 records per page
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem
                          value="10"
                          className="cursor-pointer"
                        >
                          10 records per page
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem
                          value="25"
                          className="cursor-pointer"
                        >
                          25 records per page
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem
                          value="50"
                          className="cursor-pointer"
                        >
                          50 records per page
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem
                          value="100"
                          className="cursor-pointer"
                        >
                          100 records per page
                        </ContextMenuRadioItem>
                      </ContextMenuRadioGroup>
                    </ContextMenuGroup>
                    <ContextMenuGroup>
                      <ContextMenuLabel>Export Format</ContextMenuLabel>
                      <ContextMenuRadioGroup
                        value={Settings.exportFormat}
                        onValueChange={(value) =>
                          updateSetting(
                            "exportFormat",
                            value as SettingsExportFormat,
                          )
                        }
                      >
                        <ContextMenuRadioItem
                          value="csv"
                          className="cursor-pointer"
                        >
                          CSV
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem
                          value="excel"
                          className="cursor-pointer"
                        >
                          Excel
                        </ContextMenuRadioItem>
                      </ContextMenuRadioGroup>
                    </ContextMenuGroup>
                  </ContextMenuSubContent>
                </ContextMenuSub>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuLabel>Log Out</ContextMenuLabel>
                <ContextMenuItem
                  variant="destructive"
                  onClick={async () => await SignOut()}
                  className="cursor-pointer"
                >
                  <LogOutIcon /> Log out
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Support</ContextMenuLabel>
            <ContextMenuItem className="cursor-pointer">
              <Link to="/feedback" className="flex items-center gap-2 w-full">
                <ChatBubbleBottomCenterTextIcon /> Submit Feedback
              </Link>
            </ContextMenuItem>
            <ContextMenuItem className="cursor-pointer">
              <Link to="/report" className="flex items-center  gap-2 w-full">
                <BugIcon /> Report An Issue
              </Link>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>

      <WarningDialog
        IsOpen={ShowWarningDialog}
        setIsOpen={setShowWarningDialog}
      />
    </>
  );
}
