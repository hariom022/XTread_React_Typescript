import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../sidebar/Sidebar.css";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const tyreActionItems = [
  {
    path: "/collection",
    label: "Collection",
    iconClass: "bi bi-collection-fill",
  },
  {
    path: "/customerApproval",
    label: "Customer Approval",
    iconClass: "bi bi-person-check-fill",
  },
  {
    path: "/receiving",
    label: "Receiving",
    iconClass: "bi bi-file-arrow-down-fill",
  },
  {
    path: "/visualinspection",
    label: "Visual Inspection",
    iconClass: "bi bi-eye-fill",
  },
  {
    path: "/nailinspection",
    label: "Nail Inspection",
    iconClass: "bi bi-clipboard-check-fill",
  },
  {
    path: "/pressuretest",
    label: "Pressure Test",
    iconClass: "bi bi-speedometer2",
  },
  {
    path: "/shearography",
    label: "Shearography",
    iconClass: "bi bi-soundwave",
  },
  { path: "/buffing", label: "Buffing Stage", iconClass: "bi bi-brush-fill" },
  {
    path: "/skiving",
    label: "Skiving Stage",
    iconClass: "bi bi-gear-wide-connected",
  },
  { path: "/cementing", label: "Cementing", iconClass: "bi bi-wrench" },
  { path: "/treadbench", label: "Tread Bench", iconClass: "bi bi-tools" },
  {
    path: "/repairs",
    label: "Repairs Stage",
    iconClass: "bi bi-patch-check-fill",
  },
  {
    path: "/fillup",
    label: "Fill Up Stage",
    iconClass: "bi bi-file-arrow-up-fill",
  },
  {
    path: "/building",
    label: "Building Stage",
    iconClass: "bi bi-building-fill",
  },
  {
    path: "/enveloping",
    label: "Enveloping",
    iconClass: "bi bi-envelope-fill",
  },
  { path: "/curing", label: "Curing", iconClass: "bi bi-gear-fill" },
  {
    path: "/qualityInspect",
    label: "Quality Control",
    iconClass: "bi bi-check-circle-fill",
  },
  {
    path: "/dispatch",
    label: "Dispatch",
    iconClass: "bi bi-arrow-up-right-square-fill",
  },
];

const adminItems = [
  { path: "/users", label: "User Management", iconClass: "bi bi-people-fill" },
  {
    path: "/roles",
    label: "Role Management",
    iconClass: "bi bi-shield-lock-fill",
  },
  {
    path: "/roleauthorization",
    label: "Role Authorization",
    iconClass: "bi bi-key-fill",
  },
  {
    path: "/employee",
    label: "Employee Management",
    iconClass: "bi bi-people-fill",
  },
  {
    path: "/patternApproval",
    label: "Pattern Approval",
    iconClass: "bi bi-clipboard-check-fill",
  },
  {
    path: "/tyreOnHold",
    label: "Tyre On Hold",
    iconClass: "bi bi-pause-circle-fill",
  },
  {
    path: "/productionManager",
    label: "Production Manager",
    iconClass: "bi bi-gear-wide-connected",
  },
  {
    path: "/notification",
    label: "Notification Center",
    iconClass: "bi bi-bell-fill",
  },
  {
    path: "/report",
    label: "Report",
    iconClass: "bi bi-bar-chart-fill",
  },

  {
    path: "/claimAdministration",
    label: "Claim Administration",
    iconClass: "bi bi-clipboard2-check-fill",
  },
  {
    path: "/aduitLog",
    label: "Aduit Log ",
    iconClass: "bi bi-clock-history",
  },
  {
    path: "/stockManagement",
    label: "Stock Management ",
    iconClass: "bi bi-box-seam-fill",
  },
];
const masterItems = [
  { path: "/customer", label: "Customer", iconClass: "bi bi-building-fill" },
  {
    path: "/region",
    label: "Region",
    iconClass: "bi bi-globe-central-south-asia",
  },
  { path: "/zone", label: "Zone", iconClass: "bi bi-map-fill" },
  { path: "/collector", label: "Collector", iconClass: "bi bi-truck" },
  {
    path: "/employee",
    label: "Employee",
    iconClass: "bi bi-person-badge-fill",
  },
  { path: "/servicetype", label: "Service Type", iconClass: "bi bi-tools" },
  { path: "/category", label: "Category", iconClass: "bi bi-tags-fill" },
  { path: "/material", label: "Material", iconClass: "bi bi-box-seam-fill" },
  {
    path: "/tyresize",
    label: "Tyre Size",
    iconClass: "bi bi-aspect-ratio-fill",
  },
  {
    path: "/tyremake",
    label: "Tyre Make",
    iconClass: "bi bi-truck-front-fill",
  },
  { path: "/pattern", label: "Pattern", iconClass: "bi bi-grid-3x3-gap-fill" },
  { path: "/width", label: "Width", iconClass: "bi bi-arrows-expand" },
  { path: "/machine", label: "Machine", iconClass: "bi bi-cpu-fill" },
  { path: "/autoclave", label: "Autoclave", iconClass: "bi bi-gear-fill" },
  { path: "/mold", label: "Mold", iconClass: "bi bi-circle-square" },
  {
    path: "/damagelevel",
    label: "Damage Level",
    iconClass: "bi bi-graph-up-arrow",
  },
  {
    path: "/holdreason",
    label: "Hold Reason",
    iconClass: "bi bi-pause-circle-fill",
  },
  {
    path: "/rejectionreason",
    label: "Rejection Reason",
    iconClass: "bi bi-x-octagon-fill",
  },
  { path: "/location", label: "Location", iconClass: "bi bi-geo-alt-fill" },
  {
    path: "/damagetype",
    label: "Damage Type",
    iconClass: "bi bi-exclamation-triangle-fill",
  },
  {
    path: "/repairmaterial",
    label: "Repair Material",
    iconClass: "bi bi-wrench-adjustable-circle-fill",
  },
];
const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showTyreAction, setShowTyreAction] = useState(true);
  const [showAdminPortal, setShowAdminPortal] = useState(false);
  const [showMasterPage, setshowMasterPage] = useState(false);

  const renderMenuItem = (item: any, child = false) => {
    const isActive = location.pathname === item.path;

    return (
      <li key={item.path}>
        <button
          onClick={() => navigate(item.path)}
          className={`nav-link-custom ${isActive ? "active-link" : ""}`}
          style={{
            cursor: "pointer",
            width: "100%",
            border: "none",
            background: "transparent",
            textAlign: "left",
            paddingLeft: child && !isCollapsed ? "38px" : "16px",
          }}
          title={isCollapsed ? item.label : undefined}
        >
          <span className="me-3 d-inline-flex align-items-center">
            <i
              className={item.iconClass}
              style={{
                fontSize: "18px",
                color: isActive
                  ? "var(--color-primary)"
                  : "var(--color-outline)",
              }}
            />
          </span>

          {!isCollapsed && (
            <span
              className="font-mono text-uppercase text-truncate"
              style={{
                fontSize: "10px",
                letterSpacing: "0.5px",
              }}
            >
              {item.label}
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <aside
      id="sidebar-navigation"
      className="sidebar-nav"
      style={{
        width: isCollapsed ? "80px" : "260px",
      }}
    >
      {/* Branding */}

      <div className={`p-4 ${isCollapsed ? "text-center" : "px-4 mb-3"}`}>
        {isCollapsed ? (
          <div
            className="mx-auto rounded d-flex align-items-center justify-content-center"
            style={{
              width: 40,
              height: 40,
              backgroundColor: "rgba(234,195,43,0.1)",
              border: "1px solid rgba(234,195,43,0.3)",
            }}
          >
            <span className="fw-black text-secondary fs-5">XT</span>
          </div>
        ) : (
          <>
            <h1
              className="fw-bold  m-0"
              style={{ fontSize: 21, color: "white" }}
            >
              XTread
            </h1>

            <p
              className="font-mono text-outline m-0 mt-1 text-uppercase text-light"
              style={{
                fontSize: 10,
                letterSpacing: 1,
                color: "white",
              }}
            >
              Retreading Management
            </p>
          </>
        )}
      </div>

      {/* Navigation */}

      <nav className="flex-grow-1 overflow-y-auto custom-scrollbar px-2">
        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
          {/* Dashboard */}

          {renderMenuItem({
            path: "/",
            label: "Dashboard",
            iconClass: "bi bi-bar-chart-line-fill",
          })}
          {/* Admin Portal */}

          <li>
            <button
              onClick={() => setShowAdminPortal(!showAdminPortal)}
              className="nav-link-custom"
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
              }}
            >
              <span className="me-3">
                <i className="bi bi-person-gear" style={{ fontSize: 18 }} />
              </span>

              {!isCollapsed && (
                <>
                  <span
                    className="flex-grow-1 font-mono text-uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".5px",
                    }}
                  >
                    Admin Portal
                  </span>

                  <i
                    className={`bi ${
                      showAdminPortal ? "bi-chevron-down" : "bi-chevron-right"
                    }`}
                  />
                </>
              )}
            </button>
          </li>
          {showAdminPortal &&
            adminItems.map((item) => renderMenuItem(item, true))}


          {/* Master Modules */}
          <li>
            <button
              onClick={() => setshowMasterPage(!showMasterPage)}
              className="nav-link-custom"
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
              }}
            >
              <span className="me-3">
                <i className="bi bi-collection-fill" style={{ fontSize: 18 }} />
              </span>
              {!isCollapsed && (
                <>
                  <span
                    className="flex-grow-1 font-mono text-uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".5px",
                    }}
                  >
                    Master Modules
                  </span>
                  <i
                    className={`bi ${
                      showMasterPage ? "bi-chevron-down" : "bi-chevron-right"
                    }`}
                  />
                </>
              )}
            </button>
          </li>
          {showMasterPage &&
            masterItems.map((item) => renderMenuItem(item, true))}
          {/* Tyre Action */}

          <li>
            <button
              onClick={() => setShowTyreAction(!showTyreAction)}
              className="nav-link-custom"
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
              }}
            >
              <span className="me-3">
                <i className="bi bi-truck" style={{ fontSize: 18 }} />
              </span>

              {!isCollapsed && (
                <>
                  <span
                    className="flex-grow-1 font-mono text-uppercase"
                    style={{
                      fontSize: 10,
                      letterSpacing: ".5px",
                    }}
                  >
                    Tyre Action
                  </span>

                  <i
                    className={`bi ${
                      showTyreAction ? "bi-chevron-down" : "bi-chevron-right"
                    }`}
                  />
                </>
              )}
            </button>
          </li>

          {showTyreAction &&
            tyreActionItems.map((item) => renderMenuItem(item, true))}
        </ul>
      </nav>

      {/* Collapse Button */}

      <div
        className="p-2 border-top"
        style={{
          borderColor: "rgba(255,255,255,.08)",
        }}
      >
        <button
          onClick={onToggleCollapse}
          className="nav-link-custom"
          style={{
            width: "100%",
            border: "none",
            background: "transparent",
          }}
        >
          <span className="me-3">
            <i
              className={`bi ${
                isCollapsed ? "bi-chevron-right" : "bi-chevron-left"
              }`}
            />
          </span>

          {!isCollapsed && (
            <span
              className="font-mono text-uppercase"
              style={{
                fontSize: 10,
                letterSpacing: ".5px",
              }}
            >
              Collapse View
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
