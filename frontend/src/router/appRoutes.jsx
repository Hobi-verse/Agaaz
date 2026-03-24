import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Home = lazy(() => import("../pages/Home"));
const CloseRegistration = lazy(
  () => import("../pages/Registration/CloseRegistration"),
);
const SportDetail = lazy(() => import("../pages/SportDetail/SportDetail"));
const AllSports = lazy(() => import("../pages/AllSports/AllSports"));
const Committee = lazy(() => import("../pages/Committee/Committee"));
const Rules = lazy(() => import("../pages/Rules/Rules"));
const CodeOfConduct = lazy(() => import("../pages/CodeOfConduct/CodeOfConduct"));
const RefundPolicy = lazy(() => import("../pages/RefundPolicy/RefundPolicy"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const CrashTest = lazy(() => import("../pages/CrashTest/CrashTest"));
const Schedule = lazy(() => import("../pages/Schedule/Schedule"));

export const appRoutes = [
  { path: "/", element: <Home /> },
  { path: "/register", element: <CloseRegistration /> },
  { path: "/sports", element: <AllSports /> },
  { path: "/sport/:sportId", element: <SportDetail /> },
  { path: "/committee", element: <Committee /> },
  { path: "/live-match-score", element: <Schedule /> },
  { path: "/schedule", element: <Navigate to="/live-match-score" replace /> },
  { path: "/rules", element: <Rules /> },
  { path: "/code-of-conduct", element: <CodeOfConduct /> },
  { path: "/refund-policy", element: <RefundPolicy /> },
  { path: "/__crash", element: <CrashTest /> },
  { path: "*", element: <NotFound /> },
];
