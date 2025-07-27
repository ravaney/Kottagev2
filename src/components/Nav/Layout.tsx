
import NavBar from "./NavBar";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import { useRef, useEffect, useState } from "react";

export default function Layout() {
  const location = useLocation();
  const navBarRef = useRef<HTMLDivElement>(null);
  const [navBarHeight, setNavBarHeight] = useState(0);
  
  // Pages where footer should be hidden
  const hideFooterPages = ['/Kottages'];
  
  // Pages where navbar should be transparent
  const transparentNavbarPages = ['/Kottages'];
  
  // Check if current path should hide footer
  const shouldHideFooter = hideFooterPages.some(page => 
    location.pathname.startsWith(page)
  );
  
  // Check if current path should have transparent navbar
  const shouldHaveTransparentNavbar = transparentNavbarPages.some(page => 
    location.pathname.startsWith(page)
  );

  // Calculate navbar height dynamically
  useEffect(() => {
    const updateNavBarHeight = () => {
      if (navBarRef.current) {
        setNavBarHeight(navBarRef.current.offsetHeight);
      }
    };

    updateNavBarHeight();
    window.addEventListener('resize', updateNavBarHeight);
    
    return () => window.removeEventListener('resize', updateNavBarHeight);
  }, []);

  return (
    <div style={shouldHideFooter ? { height: "100vh", display: "flex", flexDirection: "column" } : {}}>
      <div ref={navBarRef} style={shouldHideFooter ? { 
        position: shouldHaveTransparentNavbar ? "absolute" : "relative",
        width: "100%",
        zIndex: shouldHaveTransparentNavbar ? 1000 : "auto"
      } : {}}>
        <NavBar transparent={shouldHaveTransparentNavbar} />
      </div>
      <main style={shouldHideFooter ? { 
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        marginTop: shouldHaveTransparentNavbar ? 0 : "auto"
      } : { minHeight: "100vh" }}>
        <Outlet />
      </main>
      {!shouldHideFooter && <BottomNav />}
    </div>
  );
}
