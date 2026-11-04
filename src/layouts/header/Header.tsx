import "../header/Header.css";
import React, { useState } from "react";
// import { Bell, Settings, HelpCircle, Search, LogOut, Check, Mail, User } from "lucide-react";
import {
  Bell,
  Settings,
  HelpCircle,
  Search,
  LogOut,
  Mail,
  User,
  Menu,
} from "lucide-react";
import { useAuthStore } from "../../features/auth/store/authStore";
// import { Activity } from "../types"

// interface HeaderProps {
//   searchText: string;
//   onSearchChange: (val: string) => void;
//   // activities: Activity[];
//   // onClearActivities: () => void;
//   // onAddLog: (title: string, desc: string, typeStr: string) => void;
//   userEmail?: string;
// }

interface HeaderProps {
  searchText: string;
  onSearchChange: (val: string) => void;
  userEmail?: string;

  // New
  onToggleMobileMenu: () => void;
}

const Header = ({
  searchText,
  onSearchChange,
  userEmail = "hariommaurya022@gmail.com",
  onToggleMobileMenu,
}: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header
      className="d-flex justify-content-between align-items-center px-4 sticky-top bg-sidebar-bg border-bottom select-none"
      style={{
        height: "64px",
        borderColor: "rgba(255, 255, 255, 0.08)",
        zIndex: 1020,
        background: "#135c44",
      }}
    >
      {/* Search & Brand */}

      {/* Search & Brand */}
      <div className="d-flex align-items-center gap-3">
        {/* Tablet / Mobile Hamburger */}
        <button
          type="button"
          className="hamburger-menu-button"
          onClick={onToggleMobileMenu}
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <span className="fw-bold text-secondary fs-4 tracking-tight">
          XTread
        </span>

        <div
          className="d-none d-md-block mx-2"
          style={{
            width: "1px",
            height: "24px",
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        />

        {/* Existing Search */}
        <div
          className="position-relative d-none d-md-block"
          style={{
            color: "white",
            border: "2px solid white",
            borderRadius: "19px",
          }}
        >
          {/* Keep your existing Search input here */}
        </div>
      </div>

      {/* Actions */}
      <div className="d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center gap-2 position-relative"
          style={{ color: "white" }}
        >
          {/* Notifications Button */}
          <button
            id="notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-dark d-flex align-items-center justify-content-center p-2 rounded position-relative"
            style={{
              backgroundColor: showNotifications
                ? "rgba(255, 255, 255, 0.1)"
                : "transparent",
              border: "none",
              color: "var(--color-on-surface-variant)",
              cursor: "pointer",
            }}
          >
            <Bell style={{ width: "18px", height: "18px" }} />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="position-absolute bg-surface-container-high border border-outline-variant rounded shadow-lg p-3"
              style={{
                right: 0,
                top: "44px",
                width: "320px",
                zIndex: 1050,
                borderColor: "rgba(255, 255, 255, 0.15)",
              }}
            >
              <div
                className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3"
                style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <span className="font-mono text-xs text-uppercase fw-bold text-on-surface text-white">
                  Live Notifications
                </span>
              </div>
              <div
                className="custom-scrollbar space-y-3 overflow-y-auto"
                style={{ maxHeight: "250px" }}
              ></div>
            </div>
          )}

          {/* System status self-test */}
          <button
            id="settings-info-button"
            onClick={() => {
              alert(
                "Diagnosis trigger code active! Self-test logs created at Recent Activities feed.",
              );
            }}
            title="Trigger System Self-Test"
            className="btn btn-dark d-flex align-items-center justify-content-center p-2 rounded"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "var(--color-on-surface-variant)",
              cursor: "pointer",
            }}
          >
            <Settings style={{ width: "18px", height: "18px" }} />
          </button>

          {/* Help Manual */}
          <button
            id="help-button"
            onClick={() => setShowHelpModal(true)}
            className="btn btn-dark d-flex align-items-center justify-content-center p-2 rounded"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "var(--color-on-surface-variant)",
              cursor: "pointer",
            }}
          >
            <HelpCircle style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        {/* User Account Info */}
        <div className="position-relative">
          <div
            id="operator-profile-trigger"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="d-flex align-items-center gap-2 ps-3 border-start cursor-pointer hover:opacity-90"
            style={{ borderColor: "rgba(255, 255, 255, 0.15)" }}
          >
            <div className="text-end d-none d-sm-block">
              <p
                className="fw-bold m-0 text-white"
                style={{ fontSize: "12px" }}
              >
                {user?.userName}
              </p>
              <p
                className="font-mono text-outline m-0 text-light"
                style={{ fontSize: "9px", letterSpacing: "0.5px" }}
              >
                {user?.roleName}
              </p>
            </div>
            <img
              alt="Operator Profile"
              className="rounded-circle border border-secondary"
              style={{ width: "32px", height: "32px", objectFit: "cover" }}
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYXtNNR7yVrzLuiM_wPkbGp9KvDlfbCM4AbA_w22Q3QFClJlBsWO_v4fdnbrM7lbPc8xn4JB2yfWAg6flca9IXDJYMBYYC0J1hua_IySsPVBwuYaaTyi9aDhbL3qJ5pqtQx4g99lFHcKs-8fB7_YKjEKL12pdfjNEpyeSENBWvogLsVsRdL-2UsPmvNrtvHvdcYFxUTgCWS3Z8kZlYUlT20b1K7Qufn9FRjn8UnfI3knpM_XevJRFkU9UgVIQ0rJyieupcApLmd4I"
            />
          </div>

          {/* User Profile Dropdown */}
          {showUserDropdown && (
            <div
              className="position-absolute bg-surface-container-high border border-outline-variant rounded shadow-lg p-3"
              style={{
                right: 0,
                top: "44px",
                width: "240px",
                zIndex: 1050,
                borderColor: "rgba(255, 255, 255, 0.15)",
                background: "#c39d6a",
              }}
            >
              <div
                className="d-flex align-items-center gap-2 pb-2 border-bottom mb-2"
                style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-secondary"
                  style={{
                    width: "36px",
                    height: "36px",
                    backgroundColor: "rgba(234, 195, 43, 0.1)",
                  }}
                >
                  <User style={{ width: "16px", height: "16px" }} />
                </div>
                <div>
                  <h4
                    className="fw-bold m-0 text-white"
                    style={{ fontSize: "12px" }}
                  >
                    {user?.fullName}
                  </h4>
                  <p className="text-outline m-0" style={{ fontSize: "10px" }}>
                    {" "}
                    {user?.roleName}
                  </p>
                </div>
              </div>
              <div className="py-2" style={{ fontSize: "11px" }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Mail
                    className="text-outline"
                    style={{ width: "12px", height: "12px" }}
                  />
                  <span
                    className="text-truncate text-outline"
                    title={userEmail}
                    style={{ maxWidth: "160px" }}
                  >
                    {user?.email}
                  </span>
                </div>
                <div className="font-mono text-outline-variant text-[9px] mt-1">
                  STA:- PLANT_B12_SECT4
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}
                className="btn btn-outline-danger btn-sm w-100 mt-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                style={{ fontSize: "11px" }}
              >
                <LogOut style={{ width: "12px", height: "12px" }} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Modal Dialog */}
      {showHelpModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1100,
          }}
        >
          <div
            className="bg-surface-container-high border rounded border-outline-variant p-4 w-100 shadow"
            style={{ maxWidth: "420px" }}
          >
            <h3 className="h6 fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <HelpCircle
                className="text-secondary"
                style={{ width: "18px", height: "18px" }}
              />{" "}
              IndustrialFlow Guide
            </h3>
            <div
              className="text-outline"
              style={{ fontSize: "12px", lineHeight: "1.5" }}
            >
              <p>
                Welcome to <strong>IndustrialFlow</strong>, a professional plant
                operations control console for Plant B-12.
              </p>
              <div
                className="p-3 bg-surface-container-low font-mono rounded mb-3 border border-outline-variant"
                style={{ fontSize: "10px" }}
              >
                <p className="fw-bold text-secondary mb-1 uppercase">
                  KEY FUNCTIONS:
                </p>
                <p className="m-0 mb-1">
                  • <strong>Sidebar</strong>: Load custom module dashboards
                  easily.
                </p>
                <p className="m-0 mb-1">
                  • <strong>Pipeline Stages</strong>: Exclude/isolate matching
                  database records by stage checks.
                </p>
                <p className="m-0 mb-1">
                  • <strong>Active Feed</strong>: Inspect state flows, spawn or
                  retire active nodes.
                </p>
                <p className="m-0">
                  • <strong>Sliders</strong>: Simulate load anomalies live.
                </p>
              </div>
              <p className="m-0">
                This system runs standard physical bounds. High telemetry
                metrics trigger automated alerts.
              </p>
            </div>
            <div className="mt-4 d-flex justify-content-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="btn btn-industrial-yellow btn-sm py-1.5 px-3"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
