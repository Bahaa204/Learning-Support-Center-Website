import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const main = document.querySelector(".main") as HTMLElement | null;
    const footer = document.querySelector(".site-footer") as HTMLElement | null;

    const originalMainPadding = main ? main.style.padding : "";
    const originalMainMarginLeft = main ? main.style.marginLeft : "";
    const originalFooterWidth = footer ? footer.style.width : "";

    if (main) {
      main.style.padding = "0px";
      main.style.marginLeft = "0px";
    }
    if (footer) footer.style.width = "100%";

    return () => {
      if (main) {
        main.style.padding = originalMainPadding;
        main.style.marginLeft = originalMainMarginLeft;
      }
      if (footer) footer.style.width = originalFooterWidth;
    };
  }, []);

  return (
    <div className='app-shell'>
      <Header
        onToggleMenu={() => setIsMenuOpen((currentValue) => !currentValue)}
        isMenuOpen={isMenuOpen}
      />
      <div className='layout'>
        <div className='login-page scrollbar-none'>
          <div className='login-panel'>
            <div className='login-hero'>
              <h1>RHU Learning Support Center</h1>
              <p>
                Sign in to manage student visits, workstudy staff, and support
                records.
              </p>
            </div>
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
