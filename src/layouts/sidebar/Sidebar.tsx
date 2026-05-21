import { Link } from "react-router-dom";
import { useState } from "react";

import {
  MdDashboard,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
} from "react-icons/md";

import "./Sidebar.css";

type SidebarProps = {
  collapsed: boolean;
};

const Sidebar = ({ collapsed }: SidebarProps) => {
  const [reportOpen, setReportOpen] =
    useState<boolean>(false);

  return (
    <div
      className={`sidebar ${
        collapsed ? "closed" : "open"
      }`}
    >
      {/* Dashboard */}
      <Link to="/" className="menuItem active">
        <MdDashboard size={20} />

        <span>Dashboards</span>

        <span className="arrow">
          <MdKeyboardArrowRight />
        </span>
      </Link>

      {/* Collection */}
      <Link to="/Collection" className="menuItem">
        <MdDashboard size={20} />

        <span>Collection</span>

       <span className="arrow">
        <MdKeyboardArrowRight />
      </span>
      </Link>
    </div>
  );
};

export default Sidebar;