import { useState } from "react";

import Tabs from "./components/Tabs";
import { ADMIN_TABS } from "./constants/adminTabs";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Login from "./pages/Login";
import Notices from "./pages/Notices";
import { clearStoredAuth, readStoredUser } from "./utils/authSession";

export default function App() {
  const [user, setUser] = useState(() => readStoredUser());
  const [tab, setTab] = useState("registrations");

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    clearStoredAuth();
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Welcome, {user.username}
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Logout
          </button>
        </div>
        <Tabs
          activeKey={tab}
          onChange={setTab}
          tabs={ADMIN_TABS}
        />

        <div className="mt-6">
          {tab === "registrations" ? <Dashboard /> : null}
          {tab === "matches" ? <Matches user={user} /> : null}
          {tab === "notices" ? <Notices /> : null}
        </div>
      </div>
    </div>
  );
}
