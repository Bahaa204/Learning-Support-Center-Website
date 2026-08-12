import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LoadingCard from "@/components/loading-card";
import SideBar from "@/components/SideBar";
import { useAuth } from "@/hooks/useAuth";
import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const { Session, Loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='app-shell'>
      <Header
        onToggleMenu={() => setIsMenuOpen((currentValue) => !currentValue)}
        isMenuOpen={isMenuOpen}
      />
      <div className='layout'>
        {!Loading && Session && (
          <>
            <SideBar
              onNavigate={() => setIsMenuOpen(false)}
              isOpen={isMenuOpen}
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

        <Suspense fallback={<LoadingCard message='Loading page' />}>
          <main className='main'>
            <Outlet />
          </main>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
