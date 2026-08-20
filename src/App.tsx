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
import ShearographyPage from "./features/shearography/page/ShearographyPage";
// import Login from "./features/auth/pages/Login";
// import ProtectedRoute from "./shared/components/ProtectedRoute";
import BuffingStage from "./features/buffing/page/BuffingStage";
import SkivingStage from "./features/skiving/page/SkivingStage";
import { CementingPage } from "./features/cementing/page/CementingPage";
import FillUpStage from "./features/fillUp/page/FillUpStage";
import BuildingStage from "./features/building/page/BuildingStage";
import RepairPage from "./features/repair/page/RepairPage";
import TreadBenchPage from "./features/treadBench/page/TreadBenchPage";
import EnvelopingStage from "./features/enveloping/page/EnvelopingStage";
import CuringStage from "./features/curing/page/CuringStage";
import QualityControl from "./features/qualityControl/page/QualityControl";
import DispatchStage from "./features/dispatch/page/DispatchStage";
import CustomersPage from "./master-modules/customers/page/CustomerPage";
import ServiceTypesPage from "./master-modules/service-types/page/ServiceTypePage";
import TyreMakesPage from "./master-modules/tyre-make/page/TyreMakesPage";
import MachinesPage from "./master-modules/machines/page/MachinesPage";
import RejectionReasonsPage from "./master-modules/rejection-reason/page/RejectionReasonsPage";
import AutoclavesPage from "./master-modules/autoclaves/page/AutoclavesPage";
import DamageLevelsPage from "./master-modules/damage-level/page/DamageLevelsPage";
import DamageTypesPage from "./master-modules/damage-types/page/DamageTypesPage";
import RepairMaterialsPage from "./master-modules/repair-materials/page/RepairMaterialsPage";
import TyreSizesPage from "./master-modules/tyre-sizes/page/TyreSizesPage";
import CategoriesPage from "./master-modules/categories/page/CategoriesPage";
import RejectedTyres from "./adminPortal/rejectedTyres/pages/RejectedTyres";
import ByPassTyres from "./adminPortal/byPassTyres/pages/ByPassTyres";
import MountingStage from "./features/mounting/page/MountingStage";

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
    <div
      className="d-flex bg-background select-none"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Background Grid */}
      <div className="overlay-grid-bg" />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className="d-flex flex-column"
        style={{
          marginLeft: isSidebarCollapsed ? "80px" : "260px",
          width: isSidebarCollapsed
            ? "calc(100% - 80px)"
            : "calc(100% - 260px)",
          height: "100vh",
          overflow: "hidden",
          transition: "all 0.3s ease",
        }}
      >
        <Header searchText={searchText} onSearchChange={setSearchText} />

        <div
          className="custom-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
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
                <Route path="/dashboard" element={<Dashboard />} />
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
                <Route path="/pressuretest" element={<PressureTestPage />} />
                <Route path="/shearography" element={<ShearographyPage />} />
                <Route path="/buffing" element={<BuffingStage />} />
                <Route path="/skiving" element={<SkivingStage />} />
                <Route path="/cementing" element={<CementingPage />} />
                <Route path="/fillUp" element={<FillUpStage />} />
                <Route path="/building" element={<BuildingStage />} />
                <Route path="/repairs" element={<RepairPage />} />
                <Route path="/treadBench" element={<TreadBenchPage />} />
                <Route path="/enveloping" element={<EnvelopingStage />} />
                 <Route path="/mounting" element={<MountingStage />} />
                <Route path="/curing" element={<CuringStage />} />
                <Route path="/qualityControl" element={<QualityControl />} />
                <Route path="/dispatch" element={<DispatchStage />} />
                <Route path="/adminPortal/rejectedTyres" element={<RejectedTyres />} /> 
                <Route path="/adminPortal/byPassTyres" element={<ByPassTyres />} />
                {/* MASTER MODULES */}
                <Route path="/customer" element={<CustomersPage />} />
                <Route path="/serviceType" element={<ServiceTypesPage />} />
                <Route path="/tyreMake" element={<TyreMakesPage />} />
                <Route path="/machine" element={<MachinesPage />} />
                <Route path="/rejectionReason" element={<RejectionReasonsPage />} />
                <Route path="/Autoclave" element={<AutoclavesPage/>} />
                <Route path="/damageLevel" element={<DamageLevelsPage/>} />
                <Route path="/damageType" element={<DamageTypesPage/>} />
                <Route path="/repairMaterial" element={<RepairMaterialsPage/>} />
                <Route path="/tyreSize" element={<TyreSizesPage/>} />
                <Route path="/category" element={<CategoriesPage/>} />
                

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
