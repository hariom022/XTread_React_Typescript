import React, { useState } from "react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import "../sidebar/Sidebar.css";

import { useAuthStore } from "../../features/auth/store/authStore";

import type {
  ModuleItem,
} from "../../features/modules/types/moduleTypes";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) => {

  const navigate = useNavigate();

  const location = useLocation();

  const hasModule = useAuthStore(
    (state) => state.hasModule
  );

  const moduleTree = useAuthStore(
    (state) => state.moduleTree
  );

  const [openModules, setOpenModules] =
    useState<Record<string, boolean>>({});

  /* =========================================================
     TOGGLE PARENT MODULE
  ========================================================= */

  const toggleModule = (
    moduleCode: string
  ) => {
    setOpenModules((prev) => ({
      ...prev,
      [moduleCode]:
        !prev[moduleCode],
    }));
  };

  /* =========================================================
     CHECK USER PERMISSION
  ========================================================= */

  const hasVisibleChildren = (
    module: ModuleItem
  ) => {
    return module.children?.some(
      (child) =>
        child.isActive &&
        hasModule(child.moduleCode)
    );
  };

  /* =========================================================
     RENDER CHILD MODULE
  ========================================================= */

  const renderChildModule = (
    module: ModuleItem
  ) => {

    if (!module.isActive) {
      return null;
    }

    if (!hasModule(module.moduleCode)) {
      return null;
    }

    if (!module.route) {
      return null;
    }

    const isActive =
      location.pathname === module.route;

    return (
      <li key={module.id}>

        <button
          onClick={() =>
            navigate(module.route!)
          }
          className={`nav-link-custom ${
            isActive
              ? "active-link"
              : ""
          }`}
          style={{
            cursor: "pointer",
            width: "100%",
            border: "none",
            background: "transparent",
            textAlign: "left",

            paddingLeft:
              isCollapsed
                ? "16px"
                : "38px",
          }}

          title={
            isCollapsed
              ? module.moduleName
              : undefined
          }
        >

          <span className="me-3 d-inline-flex align-items-center">

            <i
              className={
                module.icon ||
                "bi bi-circle"
              }
              style={{
                fontSize: "18px",

                color:
                  isActive
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
              {module.moduleName}
            </span>
          )}

        </button>

      </li>
    );
  };

  /* =========================================================
     RENDER PARENT MODULE
  ========================================================= */

  const renderParentModule = (
    module: ModuleItem
  ) => {

    if (!module.isActive) {
      return null;
    }

    const visibleChildren =
      module.children?.filter(
        (child) =>
          child.isActive &&
          hasModule(child.moduleCode) &&
          child.route
      ) ?? [];

    /*
     * Don't show parent module
     * if user has no child permissions.
     */
    if (visibleChildren.length === 0) {
      return null;
    }

    const isOpen =
      openModules[module.moduleCode] ??
      false;

    return (
      <React.Fragment key={module.id}>

        {/* PARENT */}

        <li>

          <button
            onClick={() =>
              toggleModule(
                module.moduleCode
              )
            }
            className="nav-link-custom"
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
            }}
          >

            <span className="me-3">

              <i
                className={
                  module.icon ||
                  "bi bi-folder"
                }
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
                    letterSpacing: ".5px",
                  }}
                >
                  {module.moduleName}
                </span>

                <i
                  className={`bi ${
                    isOpen
                      ? "bi-chevron-down"
                      : "bi-chevron-right"
                  }`}
                />

              </>
            )}

          </button>

        </li>

        {/* CHILDREN */}

        {isOpen &&
          visibleChildren.map(
            renderChildModule
          )}

      </React.Fragment>
    );
  };

  return (

    <aside
      id="sidebar-navigation"
      className="sidebar-nav"
      style={{
        width:
          isCollapsed
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
              API MODULE TREE
          ================================================= */}

          {moduleTree
            .filter(
              (module) =>
                module.isActive
            )
            .sort(
              (a, b) =>
                a.displayOrder -
                b.displayOrder
            )
            .map(
              renderParentModule
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