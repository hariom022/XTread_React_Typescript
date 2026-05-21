import { Outlet } from "react-router-dom";
import { useState } from "react";

import Header from "./layouts/header/Header";
import Sidebar from "./layouts/sidebar/Sidebar";
const Layout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`container-scroller ${
        collapsed ? "sidebar-icon-only" : ""
      }`}
    >
      <Header toggleSidebar={toggleSidebar} />

      <div className="container-fluid page-body-wrapper">
        <Sidebar collapsed={collapsed} />

        <div className="main-panel">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;