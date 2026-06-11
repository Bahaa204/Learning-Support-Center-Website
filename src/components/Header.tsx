import { useState } from "react";
import RHULogo from "/Images/rhu_logo.png";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

type HeaderProps = {
  onToggleMenu: () => void;
  isMenuOpen: boolean;
};

export default function Header({ onToggleMenu, isMenuOpen }: HeaderProps) {
  const { Session, SignOut, Loading: AuthLoading } = useAuth();

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
          <button
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
          </button>
        )}
        <div className='header-brand relative'>
          <img src={RHULogo} alt='RHU Logo' className='header-logo' />
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
                          src={Session.user.user_metadata?.avatar_url || ""}
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
                      <DropdownMenuItem>
                        Display Name:{" "}
                        {Session.user.user_metadata?.display_name || "N/A"}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Email: {Session.user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Button variant='secondary'>
                          <Link to='/settings'>Settings</Link>
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem variant='destructive'>
                        <Button
                          variant='destructive'
                          onClick={LogOut}
                          className='cursor-pointer'
                        >
                          LogOut
                        </Button>
                      </DropdownMenuItem>
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
