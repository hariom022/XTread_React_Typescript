import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "../sidebar/Sidebar.css";

import { useAuthStore } from "../../features/auth/store/authStore";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  path: string;
  label: string;
  moduleCode: string;
  iconClass: string;
}

/* =========================================================
   TYRE ACTION MODULES
========================================================= */

const tyreActionItems: MenuItem[] = [
  {
    path: "/collection",
    label: "Collection",
    moduleCode: "COLLECTION",
    iconClass: "bi bi-collection-fill",
  },
  {
    path: "/customerApproval",
    label: "Customer Approval",
    moduleCode: "CUSTOMER_APPROVAL",
    iconClass: "bi bi-person-check-fill",
  },
  {
    path: "/receiving",
    label: "Receiving",
    moduleCode: "RECEIVING",
    iconClass: "bi bi-file-arrow-down-fill",
  },
  {
    path: "/visualinspection",
    label: "Visual Inspection",
    moduleCode: "VISUAL_INSPECTION",
    iconClass: "bi bi-eye-fill",
  },
  {
    path: "/nailinspection",
    label: "Nail Inspection",
    moduleCode: "NAIL_INSPECTION",
    iconClass: "bi bi-clipboard-check-fill",
  },
  {
    path: "/pressuretest",
    label: "Pressure Test",
    moduleCode: "PRESSURE_TEST",
    iconClass: "bi bi-speedometer2",
  },
  {
    path: "/shearography",
    label: "Shearography",
    moduleCode: "SHEAROGRAPHY",
    iconClass: "bi bi-soundwave",
  },
  {
    path: "/buffing",
    label: "Buffing Stage",
    moduleCode: "BUFFING",
    iconClass: "bi bi-brush-fill",
  },
  {
    path: "/skiving",
    label: "Skiving Stage",
    moduleCode: "SKIVING",
    iconClass: "bi bi-gear-wide-connected",
  },
  {
    path: "/cementing",
    label: "Cementing",
    moduleCode: "CEMENTING",
    iconClass: "bi bi-wrench",
  },
  {
    path: "/treadBench",
    label: "Tread Bench",
    moduleCode: "TREAD_BENCH",
    iconClass: "bi bi-tools",
  },
  {
    path: "/repairs",
    label: "Repairs Stage",
    moduleCode: "REPAIRS",
    iconClass: "bi bi-patch-check-fill",
  },
  {
    path: "/fillUp",
    label: "Fill Up Stage",
    moduleCode: "FILL_UP",
    iconClass: "bi bi-file-arrow-up-fill",
  },
  {
    path: "/building",
    label: "Building Stage",
    moduleCode: "BUILDING",
    iconClass: "bi bi-building-fill",
  },
  {
    path: "/enveloping",
    label: "Enveloping",
    moduleCode: "ENVELOPING",
    iconClass: "bi bi-envelope-fill",
  },
  {
    path: "/mounting",
    label: "Mounting",
    moduleCode: "MOUNTING",
    iconClass: "bi bi-gpu-card",
  },
  {
    path: "/curing",
    label: "Curing",
    moduleCode: "CURING",
    iconClass: "bi bi-gear-fill",
  },
  {
    path: "/qualityControl",
    label: "Quality Control",
    moduleCode: "QUALITY_CONTROL",
    iconClass: "bi bi-check-circle-fill",
  },
  {
    path: "/dispatch",
    label: "Dispatch",
    moduleCode: "DISPATCH",
    iconClass: "bi bi-arrow-up-right-square-fill",
  },
];

/* =========================================================
   ADMIN MODULES
========================================================= */

const adminItems: MenuItem[] = [
  {
    path: "/users",
    label: "User Management",
    moduleCode: "USER_MANAGEMENT",
    iconClass: "bi bi-people-fill",
  },
  {
    path: "/roles",
    label: "Role Management",
    moduleCode: "ROLE_MANAGEMENT",
    iconClass: "bi bi-shield-lock-fill",
  },
  {
    path: "/roleauthorization",
    label: "Role Authorization",
    moduleCode: "ROLE_AUTHORIZATION",
    iconClass: "bi bi-key-fill",
  },
  {
    path: "/employee",
    label: "Employee Management",
    moduleCode: "EMPLOYEE_MANAGEMENT",
    iconClass: "bi bi-people-fill",
  },
  {
    path: "/patternApproval",
    label: "Pattern Approval",
    moduleCode: "PATTERN_APPROVAL",
    iconClass: "bi bi-clipboard-check-fill",
  },
  {
    path: "/tyreOnHold",
    label: "Tyre On Hold",
    moduleCode: "TYRE_ON_HOLD",
    iconClass: "bi bi-pause-circle-fill",
  },
  {
    path: "/productionManager",
    label: "Production Manager",
    moduleCode: "PRODUCTION_MANAGER",
    iconClass: "bi bi-gear-wide-connected",
  },
  {
    path: "/adminPortal/byPassTyres",
    label: "ByPass Tyres",
    moduleCode: "BYPASS_TYRES",
    iconClass: "bi bi-gear-wide",
  },
  {
    path: "/adminPortal/rejectedTyres",
    label: "Rejected Tyres",
    moduleCode: "REJECTED_TYRES",
    iconClass: "bi bi-x-octagon-fill",
  },
  {
    path: "/notification",
    label: "Notification Center",
    moduleCode: "NOTIFICATION_CENTER",
    iconClass: "bi bi-bell-fill",
  },
  {
    path: "/report",
    label: "Report",
    moduleCode: "REPORT",
    iconClass: "bi bi-bar-chart-fill",
  },
  {
    path: "/claimAdministration",
    label: "Claim Administration",
    moduleCode: "CLAIM_ADMINISTRATION",
    iconClass: "bi bi-clipboard2-check-fill",
  },
  {
    path: "/auditLog",
    label: "Audit Log",
    moduleCode: "AUDIT_LOG",
    iconClass: "bi bi-clock-history",
  },
  {
    path: "/stockManagement",
    label: "Stock Management",
    moduleCode: "STOCK_MANAGEMENT",
    iconClass: "bi bi-box-seam-fill",
  },
];

/* =========================================================
   MASTER MODULES
========================================================= */

const masterItems: MenuItem[] = [
  {
    path: "/customer",
    label: "Customer",
    moduleCode: "CUSTOMER",
    iconClass: "bi bi-building-fill",
  },
  {
    path: "/region",
    label: "Region",
    moduleCode: "REGION",
    iconClass: "bi bi-globe-central-south-asia",
  },
  {
    path: "/zone",
    label: "Zone",
    moduleCode: "ZONE",
    iconClass: "bi bi-map-fill",
  },
  {
    path: "/collector",
    label: "Collector",
    moduleCode: "COLLECTOR",
    iconClass: "bi bi-truck",
  },
  {
    path: "/employee",
    label: "Employee",
    moduleCode: "EMPLOYEE",
    iconClass: "bi bi-person-badge-fill",
  },
  {
    path: "/serviceType",
    label: "Service Type",
    moduleCode: "SERVICE_TYPE",
    iconClass: "bi bi-tools",
  },
  {
    path: "/category",
    label: "Category",
    moduleCode: "CATEGORY",
    iconClass: "bi bi-tags-fill",
  },
  {
    path: "/material",
    label: "Material",
    moduleCode: "MATERIAL",
    iconClass: "bi bi-box-seam-fill",
  },
  {
    path: "/tyreSize",
    label: "Tyre Size",
    moduleCode: "TYRE_SIZE",
    iconClass: "bi bi-aspect-ratio-fill",
  },
  {
    path: "/tyreMake",
    label: "Tyre Make",
    moduleCode: "TYRE_MAKE",
    iconClass: "bi bi-truck-front-fill",
  },
  {
    path: "/pattern",
    label: "Pattern",
    moduleCode: "PATTERN",
    iconClass: "bi bi-grid-3x3-gap-fill",
  },
  {
    path: "/width",
    label: "Width",
    moduleCode: "WIDTH",
    iconClass: "bi bi-arrows-expand",
  },
  {
    path: "/machine",
    label: "Machine",
    moduleCode: "MACHINE",
    iconClass: "bi bi-cpu-fill",
  },
  {
    path: "/autoclave",
    label: "Autoclave",
    moduleCode: "AUTOCLAVE",
    iconClass: "bi bi-gear-fill",
  },
  {
    path: "/mold",
    label: "Mold",
    moduleCode: "MOLD",
    iconClass: "bi bi-circle-square",
  },
  {
    path: "/damagelevel",
    label: "Damage Level",
    moduleCode: "DAMAGE_LEVEL",
    iconClass: "bi bi-graph-up-arrow",
  },
  {
    path: "/holdreason",
    label: "Hold Reason",
    moduleCode: "HOLD_REASON",
    iconClass: "bi bi-pause-circle-fill",
  },
  {
    path: "/rejectionreason",
    label: "Rejection Reason",
    moduleCode: "REJECTION_REASON",
    iconClass: "bi bi-x-octagon-fill",
  },
  {
    path: "/location",
    label: "Location",
    moduleCode: "LOCATION",
    iconClass: "bi bi-geo-alt-fill",
  },
  {
    path: "/damagetype",
    label: "Damage Type",
    moduleCode: "DAMAGE_TYPE",
    iconClass: "bi bi-exclamation-triangle-fill",
  },
  {
    path: "/repairmaterial",
    label: "Repair Material",
    moduleCode: "REPAIR_MATERIAL",
    iconClass: "bi bi-wrench-adjustable-circle-fill",
  },
];

/* =========================================================
   SIDEBAR
========================================================= */

const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasModule = useAuthStore(
    (state) => state.hasModule
  );

  const [showTyreAction, setShowTyreAction] =
    useState(true);

  const [showAdminPortal, setShowAdminPortal] =
    useState(false);

  const [showMasterPage, setShowMasterPage] =
    useState(false);

  /* =========================================================
     CHECK WHETHER ANY CHILD MODULE IS AVAILABLE
  ========================================================= */

  const hasAnyModule = (items: MenuItem[]) => {
    return items.some((item) =>
      hasModule(item.moduleCode)
    );
  };

  /* =========================================================
     RENDER MENU ITEM
  ========================================================= */

  const renderMenuItem = (
    item: MenuItem,
    child = false
  ) => {
    /*
     * Don't show menu item if
     * user doesn't have permission.
     */
    if (!hasModule(item.moduleCode)) {
      return null;
    }

    const isActive =
      location.pathname === item.path;

    return (
      <li key={item.path}>
        <button
          onClick={() => navigate(item.path)}
          className={`nav-link-custom ${
            isActive ? "active-link" : ""
          }`}
          style={{
            cursor: "pointer",
            width: "100%",
            border: "none",
            background: "transparent",
            textAlign: "left",
            paddingLeft:
              child && !isCollapsed
                ? "38px"
                : "16px",
          }}
          title={
            isCollapsed
              ? item.label
              : undefined
          }
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
        width: isCollapsed
          ? "80px"
          : "260px",
      }}
    >
      {/* =====================================================
          BRANDING
      ===================================================== */}

      <div
        className={`p-4 ${
          isCollapsed
            ? "text-center"
            : "px-4 mb-3"
        }`}
      >
        {isCollapsed ? (
          <div
            className="mx-auto rounded d-flex align-items-center justify-content-center"
            style={{
              width: 40,
              height: 40,
              backgroundColor:
                "rgba(234,195,43,0.1)",
              border:
                "1px solid rgba(234,195,43,0.3)",
            }}
          >
            <span className="fw-black text-secondary fs-5">
              XT
            </span>
          </div>
        ) : (
          <>
            <h1
              className="fw-bold m-0"
              style={{
                fontSize: 21,
                color: "white",
              }}
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

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-grow-1 overflow-y-auto custom-scrollbar px-2">
        <ul className="list-unstyled m-0 p-0 d-flex flex-column gap-1">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          <li>
            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className={`nav-link-custom ${
                location.pathname ===
                "/dashboard"
                  ? "active-link"
                  : ""
              }`}
              style={{
                cursor: "pointer",
                width: "100%",
                border: "none",
                background: "transparent",
                textAlign: "left",
                paddingLeft: "16px",
              }}
            >
              <span className="me-3 d-inline-flex align-items-center">
                <i
                  className="bi bi-bar-chart-line-fill"
                  style={{
                    fontSize: 18,
                    color:
                      location.pathname ===
                      "/dashboard"
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
                  Dashboard
                </span>
              )}
            </button>
          </li>

          {/* =================================================
              ADMIN PORTAL
          ================================================= */}

          {hasAnyModule(adminItems) && (
            <>
              <li>
                <button
                  onClick={() =>
                    setShowAdminPortal(
                      !showAdminPortal
                    )
                  }
                  className="nav-link-custom"
                  style={{
                    width: "100%",
                    border: "none",
                    background:
                      "transparent",
                  }}
                >
                  <span className="me-3">
                    <i
                      className="bi bi-person-gear"
                      style={{
                        fontSize: 18,
                      }}
                    />
                  </span>

                  {!isCollapsed && (
                    <>
                      <span
                        className="flex-grow-1 font-mono text-uppercase"
                        style={{
                          fontSize: 10,
                          letterSpacing:
                            ".5px",
                        }}
                      >
                        Admin Portal
                      </span>

                      <i
                        className={`bi ${
                          showAdminPortal
                            ? "bi-chevron-down"
                            : "bi-chevron-right"
                        }`}
                      />
                    </>
                  )}
                </button>
              </li>

              {showAdminPortal &&
                adminItems.map((item) =>
                  renderMenuItem(
                    item,
                    true
                  )
                )}
            </>
          )}

          {/* =================================================
              MASTER MODULES
          ================================================= */}

          {hasAnyModule(masterItems) && (
            <>
              <li>
                <button
                  onClick={() =>
                    setShowMasterPage(
                      !showMasterPage
                    )
                  }
                  className="nav-link-custom"
                  style={{
                    width: "100%",
                    border: "none",
                    background:
                      "transparent",
                  }}
                >
                  <span className="me-3">
                    <i
                      className="bi bi-collection-fill"
                      style={{
                        fontSize: 18,
                      }}
                    />
                  </span>

                  {!isCollapsed && (
                    <>
                      <span
                        className="flex-grow-1 font-mono text-uppercase"
                        style={{
                          fontSize: 10,
                          letterSpacing:
                            ".5px",
                        }}
                      >
                        Master Modules
                      </span>

                      <i
                        className={`bi ${
                          showMasterPage
                            ? "bi-chevron-down"
                            : "bi-chevron-right"
                        }`}
                      />
                    </>
                  )}
                </button>
              </li>

              {showMasterPage &&
                masterItems.map((item) =>
                  renderMenuItem(
                    item,
                    true
                  )
                )}
            </>
          )}

          {/* =================================================
              TYRE ACTION
          ================================================= */}

          {hasAnyModule(tyreActionItems) && (
            <>
              <li>
                <button
                  onClick={() =>
                    setShowTyreAction(
                      !showTyreAction
                    )
                  }
                  className="nav-link-custom"
                  style={{
                    width: "100%",
                    border: "none",
                    background:
                      "transparent",
                  }}
                >
                  <span className="me-3">
                    <i
                      className="bi bi-truck"
                      style={{
                        fontSize: 18,
                      }}
                    />
                  </span>

                  {!isCollapsed && (
                    <>
                      <span
                        className="flex-grow-1 font-mono text-uppercase"
                        style={{
                          fontSize: 10,
                          letterSpacing:
                            ".5px",
                        }}
                      >
                        Tyre Action
                      </span>

                      <i
                        className={`bi ${
                          showTyreAction
                            ? "bi-chevron-down"
                            : "bi-chevron-right"
                        }`}
                      />
                    </>
                  )}
                </button>
              </li>

              {showTyreAction &&
                tyreActionItems.map(
                  (item) =>
                    renderMenuItem(
                      item,
                      true
                    )
                )}
            </>
          )}
        </ul>
      </nav>

      {/* =====================================================
          COLLAPSE BUTTON
      ===================================================== */}

      <div
        className="p-2 border-top"
        style={{
          borderColor:
            "rgba(255,255,255,.08)",
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
                isCollapsed
                  ? "bi-chevron-right"
                  : "bi-chevron-left"
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