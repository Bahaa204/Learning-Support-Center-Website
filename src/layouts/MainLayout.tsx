import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const { Session, Loading, SignOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <div className='app-shell'>
      <Header onToggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
      <div className='layout'>
        {!Loading && Session && (
          <>
            <SideBar onNavigate={closeMenu} isOpen={isMenuOpen} />
            {isMenuOpen && (
              <button
                className='sidebar-overlay'
                onClick={closeMenu}
                aria-label='Close menu'
                type='button'
              />
            )}
          </>
        )}
        <ContextMenu>
          <ContextMenuTrigger asChild disabled={location.pathname === "/login"}>
            <main className='main'>
              <Outlet />
            </main>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuItem>
                Display Name:{" "}
                {Session?.user.user_metadata?.display_name || "N/A"}
              </ContextMenuItem>
              <ContextMenuItem>Email: {Session?.user.email}</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger className='font-bold cursor-pointer'>
                Settings
              </ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>
                  <Link to='/settings'>Account</Link>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <Link to='/settings'>Change Password</Link>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <Link to='/settings'>Appearance</Link>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>
                  <Link to='/settings'>Data and Records</Link>
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuItem variant='destructive'>
              <Button
                variant='destructive'
                onClick={async () => await SignOut()}
                className='cursor-pointer'
              >
                LogOut
              </Button>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
      <Footer />
    </div>
  );
}
