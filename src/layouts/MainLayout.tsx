import Footer from "@/components/Footer";
import Header from "@/components/Header";
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
import { ArrowBigLeft, ArrowBigRight, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { Session, Loading, SignOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen((currentValue) => !currentValue);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger
        asChild
        disabled={location.pathname === "/login" || Loading}
      >
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

            <main className='main'>
              <Outlet />
            </main>
          </div>
          <Footer />
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent onContextMenu={(event) => event.preventDefault()}>
        <ContextMenuGroup>
          <ContextMenuItem
            className='cursor-pointer'
            onClick={() => navigate(-1)}
          >
            <ArrowBigLeft /> Back
          </ContextMenuItem>
          <ContextMenuItem
            className='cursor-pointer'
            onClick={() => navigate(+1)}
          >
            <ArrowBigRight /> Forward
          </ContextMenuItem>
          <ContextMenuItem
            className='cursor-pointer'
            onClick={() => window.location.reload()}
          >
            <RefreshCcw /> Refresh
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>Settings</ContextMenuSubTrigger>
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
        <ContextMenuSeparator />
        <ContextMenuItem
          variant='destructive'
          onClick={async () => await SignOut()}
          className='cursor-pointer'
        >
          Log out
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
