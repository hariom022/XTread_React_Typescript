/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

// Layouts
import Sidebar from "./layouts/sidebar/Sidebar";
import Header from "./layouts/header/Header";

// Pages
import Dashboard from "./features/dashboard/pages/Dashboard";
import CollectionPage from "./features/collection/page/CollectionPage";
import CustomerApprovalPage from "./features/customerApproval/page/CustomerApprovalPage";
import ReceivingPage from "./features/receiving/page/ReceivingPage";
import VisualInspectionPage from "./features/visualInspection/page/VisualInspectionPage";
import NailInspectionPage from "./features/nailInspection/page/NailInspectionPage";
import PressureTestPage from "./features/pressureTest/page/PressureTestPage";

// Future Pages
// import ShearographyPage from "./features/shearography/page/ShearographyPage";
// import BuffingPage from "./features/buffing/page/BuffingPage";
// import SkivingPage from "./features/skiving/page/SkivingPage";
// import CementingPage from "./features/cementing/page/CementingPage";
// import TreadBenchPage from "./features/treadBench/page/TreadBenchPage";
// import RepairsPage from "./features/repairs/page/RepairsPage";
// import FillUpPage from "./features/fillUp/page/FillUpPage";
// import BuildingPage from "./features/building/page/BuildingPage";
// import EnvelopingPage from "./features/enveloping/page/EnvelopingPage";
// import CuringPage from "./features/curing/page/CuringPage";
// import QualityControlPage from "./features/qualityControl/page/QualityControlPage";
// import DispatchPage from "./features/dispatch/page/DispatchPage";

function AppContent() {
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [energyLoad, setEnergyLoad] = useState(1.2);
  const [unitTemp, setUnitTemp] = useState(182);

  useEffect(() => {
    const envTimer = setInterval(() => {
      setEnergyLoad((prev) => {
        const delta = (Math.random() - 0.5) * 0.03;
        return Math.max(0.6, Math.min(1.9, prev + delta));
      });

      setUnitTemp((prev) => {
        const delta = Math.round((Math.random() - 0.5) * 2);
        return Math.max(130, Math.min(230, prev + delta));
      });
    }, 6000);

    return () => clearInterval(envTimer);
  }, []);

  return (
    <div className="d-flex h-screen overflow-hidden bg-background select-none">
      {/* Background Grid */}
      <div className="overlay-grid-bg" />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
      />

      {/* Main Content */}
      <main className="flex-grow-1 d-flex flex-column h-100 bg-background position-relative z-index-1 overflow-hidden">
        <Header
          searchText={searchText}
          onSearchChange={setSearchText}
        />

        <div className="flex-grow-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="w-100 h-100"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route
                  path="/customerApproval"
                  element={<CustomerApprovalPage />}
                />
                <Route path="/receiving" element={<ReceivingPage />} />
                <Route
                  path="/visualinspection"
                  element={<VisualInspectionPage />}
                />
                <Route
                  path="/nailinspection"
                  element={<NailInspectionPage />}
                />
                <Route
                  path="/pressuretest"
                  element={<PressureTestPage />}
                />

                {/* Future Routes */}

                {/* <Route path="/shearography" element={<ShearographyPage />} />
                <Route path="/buffing" element={<BuffingPage />} />
                <Route path="/skiving" element={<SkivingPage />} />
                <Route path="/cementing" element={<CementingPage />} />
                <Route path="/treadbench" element={<TreadBenchPage />} />
                <Route path="/repairs" element={<RepairsPage />} />
                <Route path="/fillup" element={<FillUpPage />} />
                <Route path="/building" element={<BuildingPage />} />
                <Route path="/enveloping" element={<EnvelopingPage />} />
                <Route path="/curing" element={<CuringPage />} />
                <Route
                  path="/qualityInspect"
                  element={<QualityControlPage />}
                />
                <Route path="/dispatch" element={<DispatchPage />} /> */}
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}