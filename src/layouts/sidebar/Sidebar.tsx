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
];

const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showTyreAction, setShowTyreAction] = useState(true);
  const [showAdminPortal, setShowAdminPortal] = useState(false);

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
            <h1 className="fw-bold text-secondary m-0" style={{ fontSize: 21 }}>
              XTread
            </h1>

            <p
              className="font-mono text-outline m-0 mt-1 text-uppercase"
              style={{
                fontSize: 10,
                letterSpacing: 1,
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

          {/* Admin Portal */}
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
