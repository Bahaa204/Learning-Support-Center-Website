import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import SideBar from "@/components/SideBar";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowBigLeft,
  ArrowBigRight,
  DatabaseIcon,
  LockKeyholeIcon,
  LogOutIcon,
  Monitor,
  RefreshCcw,
  SettingsIcon,
  UserCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { Session, Loading, SignOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger
        asChild
        disabled={location.pathname === "/login" || Loading}
      >
        <div className='app-shell'>
          <Header
            onToggleMenu={() => setIsMenuOpen((currentValue) => !currentValue)}
            isMenuOpen={isMenuOpen}
          />
          <div className='layout'>
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
                    className='sidebar-overlay'
                    onClick={() => setIsMenuOpen(false)}
                    aria-label='Close menu'
                    type='button'
                  />
                )}
              </>
            )}
            <main className='main'>
              <Outlet />
            </main>
          </div>
          <Footer />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className='z-100000'>
        <ContextMenuGroup>
          <ContextMenuItem
            className='cursor-pointer flex gap-2'
            onClick={() => navigate(-1)}
          >
            <ArrowBigLeft /> Back
          </ContextMenuItem>
          <ContextMenuItem
            className='cursor-pointer flex gap-2'
            onClick={() => navigate(+1)}
          >
            Forward <ArrowBigRight />
          </ContextMenuItem>
          <ContextMenuItem
            className='cursor-pointer flex gap-2'
            onClick={() => window.location.reload()}
          >
            <RefreshCcw /> Refresh
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger className='flex gap-2'>
            <SettingsIcon /> Settings
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuGroup>
              <ContextMenuItem>
                <Link to='/settings' className='flex gap-2'>
                  <UserCircleIcon /> Account
                </Link>
              </ContextMenuItem>
              <ContextMenuItem>
                <Link to='/settings' className='flex gap-2'>
                  <LockKeyholeIcon /> Security
                </Link>
              </ContextMenuItem>
              <ContextMenuItem>
                <Link to='/settings' className='flex gap-2'>
                  <Monitor /> Appearance
                </Link>
              </ContextMenuItem>
              <ContextMenuItem>
                <Link to='/settings' className='flex gap-2'>
                  <DatabaseIcon /> Data and Records
                </Link>
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuItem
              variant='destructive'
              onClick={async () => await SignOut()}
              className='cursor-pointer'
            >
              <LogOutIcon /> Log out
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  );
}
