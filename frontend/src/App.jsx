import { Suspense, lazy, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import navLinks from "./data/navData";
import SportsLoader from "./components/SportsLoader";

const Home = lazy(() => import("./pages/Home"));
// const Registration = lazy(() => import("./pages/Registration/Registration"));
const CloseRegistration = lazy(
  () => import("./pages/Registration/CloseRegistration"),
);
const SportDetail = lazy(() => import("./pages/SportDetail/SportDetail"));
const AllSports = lazy(() => import("./pages/AllSports/AllSports"));
const FeesAwards = lazy(() => import("./pages/FeesAwards/FeesAwards"));
const Committee = lazy(() => import("./pages/Committee/Committee"));
const Rules = lazy(() => import("./pages/Rules/Rules"));
const CodeOfConduct = lazy(() => import("./pages/CodeOfConduct/CodeOfConduct"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy/RefundPolicy"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const CrashTest = lazy(() => import("./pages/CrashTest/CrashTest"));
const Schedule = lazy(() => import("./pages/Schedule/Schedule"));
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
    // <main className="min-h-[100dvh] px-4 py-10 flex items-center justify-center">
    //   <div className="w-full max-w-3xl text-center">
    //     <h1 className="text-white/95 font-black tracking-wide drop-shadow-[0_14px_30px_rgba(0,0,0,0.35)] text-3xl sm:text-5xl">
    //       We’re under Maintenance
    //     </h1>

    //     <p className="mt-4 text-white/80 text-sm sm:text-base leading-relaxed">
    //       We’ll be back soon. Please visit again after some time.
    //     </p>
    //   </div>
    // </main>
    <>
      <ScrollToHash />
      <Navbar links={navLinks} />
      <Suspense fallback={<SportsLoader fullScreen label="Loading page…" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<CloseRegistration />} />

          <Route path="/sports" element={<AllSports />} />
          <Route path="/sport/:sportId" element={<SportDetail />} />
          <Route path="/fees-awards" element={<FeesAwards />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/code-of-conduct" element={<CodeOfConduct />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/__crash" element={<CrashTest />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
