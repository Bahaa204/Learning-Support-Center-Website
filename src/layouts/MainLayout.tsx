import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const { Session, Loading } = useAuth();
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

        <main className='main'>
          <Outlet />
        </main>
      </div>

      <Footer/>
    </div>
  );
}
