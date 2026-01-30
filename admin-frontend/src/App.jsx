import { useState, useEffect } from "react";

import Tabs from "./components/Tabs";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";
import Login from "./pages/Login";

export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("registrations");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
          tabs={[
            { key: "registrations", label: "Registrations" },
            { key: "matches", label: "Matches" },
          ]}
        />

        <div className="mt-6">
          {tab === "registrations" ? <Dashboard /> : <Matches user={user} />}
        </div>
      </div>
    </div>
  );
}
