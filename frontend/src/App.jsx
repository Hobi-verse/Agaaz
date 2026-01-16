import { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import navLinks from "./data/navData";
import Home from "./pages/Home";
import Registration from "./pages/Registration/Registration";
import SportDetail from "./pages/SportDetail/SportDetail";
import AllSports from "./pages/AllSports/AllSports";
import FeesAwards from "./pages/FeesAwards/FeesAwards";
import Committee from "./pages/Committee/Committee";
import Rules from "./pages/Rules/Rules";
import CodeOfConduct from "./pages/CodeOfConduct/CodeOfConduct";
import RefundPolicy from "./pages/RefundPolicy/RefundPolicy";
import Footer from "./components/Footer";

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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/sports" element={<AllSports />} />
        <Route path="/sport/:sportId" element={<SportDetail />} />
        <Route path="/fees-awards" element={<FeesAwards />} />
        <Route path="/committee" element={<Committee />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/code-of-conduct" element={<CodeOfConduct />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
