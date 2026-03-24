import { Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import navLinks from "./data/navData";
import SportsLoader from "./components/SportsLoader";
import { appRoutes } from "./router/appRoutes";

function ScrollToHash() {
  const location = useLocation();

  // React Router doesn't automatically scroll to hash anchors.
  // This keeps in-page section links (e.g. /#schedule) working.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const id = location.hash.slice(1);
    if (!id) return;

    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };

    // Try now, then again on next tick for freshly-mounted routes.
    if (scroll()) return;
    const t = window.setTimeout(scroll, 0);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToHash />
      <Navbar links={navLinks} />
      <Suspense fallback={<SportsLoader fullScreen label="Loading page…" />}>
        <Routes>
          {appRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
