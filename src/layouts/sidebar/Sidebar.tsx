import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../sidebar/Sidebar.css"

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const sidebarItems = [
  { path: "/", label: "Dashboard", iconClass: "bi bi-bar-chart-line-fill" },
  { path: "/collection", label: "Collection", iconClass: "bi bi-collection-fill" },
  { path: "/customerApproval", label: "Customer Approval", iconClass: "bi bi-person-check-fill" },
  { path: "/receiving", label: "Receiving", iconClass: "bi bi-file-arrow-down-fill" },
  { path: "/visualinspection", label: "Visual Inspection", iconClass: "bi bi-eye-fill" },
  { path: "/nailinspection", label: "Nail Inspection", iconClass: "bi bi-clipboard-check-fill" },
  { path: "/pressuretest", label: "Pressure Test", iconClass: "bi bi-speedometer2" },
  { path: "/shearography", label: "Shearography", iconClass: "bi bi-soundwave" },
  { path: "/buffing", label: "Buffing Stage", iconClass: "bi bi-brush-fill" },
  { path: "/skiving", label: "Skiving Stage", iconClass: "bi bi-gear-wide-connected" },
  { path: "/cementing", label: "Cementing", iconClass: "bi bi-wrench" },
  { path: "/treadbench", label: "Tread Bench (Cutting)", iconClass: "bi bi-tools" },
  { path: "/repairs", label: "Repairs Stage", iconClass: "bi bi-patch-check-fill" },
  { path: "/fillup", label: "Fill Up Stage", iconClass: "bi bi-file-arrow-up-fill" },
  { path: "/building", label: "Building Stage", iconClass: "bi bi-building-fill" },
  { path: "/enveloping", label: "Enveloping", iconClass: "bi bi-envelope-fill" },
  { path: "/curing", label: "Curing", iconClass: "bi bi-gear-fill" },
  { path: "/qualityInspect", label: "Quality Control", iconClass: "bi bi-check-circle-fill" },
  { path: "/dispatch", label: "Dispatch", iconClass: "bi bi-arrow-up-right-square-fill" },
];

const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
              width: "40px",
              height: "40px",
              backgroundColor: "rgba(234, 195, 43, 0.1)",
              border: "1px solid rgba(234, 195, 43, 0.3)",
            }}
          >
            <span className="fw-black text-secondary fs-5">XT</span>
          </div>
        ) : (
          <div className="py-2">
            <h1
              className="fw-bold text-secondary text-nowrap m-0"
              style={{
                fontSize: "21px",
                letterSpacing: "-0.5px",
              }}
            >
              XTread
            </h1>

            <p
              className="font-mono text-outline m-0 mt-1 text-uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "1px",
              }}
            >
              Retreading Management
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1 overflow-y-auto custom-scrollbar px-2">
        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <button
                  id={`nav-item-${item.label.replace(/\s+/g, "-")}`}
                  onClick={() => navigate(item.path)}
                  className={`nav-link-custom ${
                    isActive ? "active-link" : ""
                  }`}
                  style={{
                    cursor: "pointer",
                    textAlign: "left",
                    outline: "none",
                    width: "100%",
                    border: "none",
                    background: "transparent",
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
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div
        className="p-2 border-top"
        style={{
          borderColor: "rgba(255, 255, 255, 0.08)",
        }}
      >
        <button
          id="toggle-sidebar-collapse"
          onClick={onToggleCollapse}
          className="nav-link-custom d-flex align-items-center"
          style={{
            cursor: "pointer",
            border: "none",
            background: "none",
            width: "100%",
          }}
        >
          <span className="me-3 d-inline-flex align-items-center">
            {isCollapsed ? (
              <i
                className="bi bi-chevron-right"
                style={{ fontSize: "18px" }}
              />
            ) : (
              <i
                className="bi bi-chevron-left"
                style={{ fontSize: "18px" }}
              />
            )}
          </span>

          {!isCollapsed && (
            <span
              className="font-mono text-uppercase"
              style={{
                fontSize: "10px",
                letterSpacing: "0.5px",
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