import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Header from "./layouts/header/Header";
import Navbar from "./layouts/navbar/Navbar";

import Dashboard from "./features/dashboard/pages/Dashboard";
import CollectionPage from "./features/collection/page/CollectionPage";
import CustomerApprovalPage from "./features/customerApproval/page/CustomerApprovalPage";
import ReceivingPage from "./features/receiving/page/ReceivingPage";
import VisualInspectionPage from "./features/visualInspection/page/VisualInspectionPage";
import NailInspectionPage from "./features/nailInspection/page/NailInspectionPage";
import PressureTestPage from "./features/pressureTest/page/PressureTestPage";
import ShearographyPage from "./features/shearography/page/ShearographyPage";
import Login from "./features/auth/pages/Login";
import ProtectedRoute from "./shared/components/ProtectedRoute";
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
import MountingStage from "./features/mounting/page/MountingStage";

const Layout = () => {
  return (
    <>
      <Header />
      <Navbar />

      <div className="content">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/customerApproval" element={<CustomerApprovalPage />} />
          <Route path="/receiving" element={<ReceivingPage />} />
          <Route path="/visualinspection" element={<VisualInspectionPage />} />
          <Route path="/nailinspection" element={<NailInspectionPage />} />
          <Route path="/pressuretest" element={<PressureTestPage />} />
          <Route path="/shearography" element={<ShearographyPage />} />
          <Route path="/buffing" element={<BuffingStage />} />
          <Route path="/skiving" element={<SkivingStage />} />
          <Route path="/cementing" element={<CementingPage />} />
          <Route path="/fillUp" element={<FillUpStage />} />
          <Route path="/building" element={<BuildingStage/>} />
          <Route path="/repairs" element={<RepairPage/>}/>
          <Route path="/treadBench" element={<TreadBenchPage />} />
          <Route path="/enveloping" element={<EnvelopingStage/>} />
          <Route path="/mounting" element={<MountingStage/>} />
          <Route path="/curing" element={<CuringStage/>} />
          <Route path="/qualityControl" element={<QualityControl/>} />
          <Route path="/dispatch" element={<DispatchStage/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
