import { useState } from "react";

import Tabs from "./components/Tabs";
import Dashboard from "./pages/Dashboard";
import Matches from "./pages/Matches";

export default function App() {
  const [tab, setTab] = useState("registrations");

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Tabs
          activeKey={tab}
          onChange={setTab}
          tabs={[
            { key: "registrations", label: "Registrations" },
            { key: "matches", label: "Matches" },
          ]}
        />

        <div className="mt-6">
          {tab === "registrations" ? <Dashboard /> : <Matches />}
        </div>
      </div>
    </div>
  );
}
