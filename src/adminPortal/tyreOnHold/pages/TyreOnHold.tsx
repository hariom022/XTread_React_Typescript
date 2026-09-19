import { useState } from "react";
import { RingLoader } from "react-spinners";

import HoldTyreIndexPage from "../components/holdTyreIndexPage";
import HoldTyreApprovalModal from "../components/holdTyreApprovalModal";

import {
  type HoldTab,
  useHoldTyreIndexPage,
} from "../hooks/useHoldTyreIndexPage";

const TyreOnHold = () => {
  // =========================================================
  // ACTIVE TAB
  // =========================================================
  const [activeTab, setActiveTab] =
    useState<HoldTab>("nail");

  // =========================================================
  // HOLD TYRE HOOK
  // =========================================================
  const {
    loading,
    search,
    setSearch,
    filteredHoldTyres,
    loadHoldTyres,
  } = useHoldTyreIndexPage(
    activeTab
  );

  // =========================================================
  // SELECTED ITEM
  // =========================================================
  const [selectedItem, setSelectedItem] =
    useState<any>(null);

  // =========================================================
  // APPROVAL MODAL
  // =========================================================
  const [
    showApprovalModal,
    setShowApprovalModal,
  ] = useState(false);

  // =========================================================
  // INSPECT
  // =========================================================
  const handleInspect = (
    item: any
  ) => {
    console.log(
      "Selected HOLD casing:",
      item
    );

    setSelectedItem(item);

    setShowApprovalModal(true);
  };

  // =========================================================
  // CLOSE APPROVAL MODAL
  // =========================================================
  const closeApprovalModal = () => {
    setShowApprovalModal(false);

    setSelectedItem(null);
  };

  // =========================================================
  // CHANGE TAB
  // =========================================================
  const handleTabChange = (
    tab: HoldTab
  ) => {
    setActiveTab(tab);
  };

  return (
    <div className="container-fluid mt-3">

      {/* =====================================================
          HOLD TABS
      ====================================================== */}
      <ul className="nav nav-tabs mb-3">

        {/* ===================================================
            NAIL INSPECTION HOLD
        ==================================================== */}
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "nail"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleTabChange("nail")
            }
          >
            Nail Inspection Hold
          </button>
        </li>

        {/* ===================================================
            SHEAROGRAPHY HOLD
        ==================================================== */}
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab ===
                "shearography"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleTabChange(
                "shearography"
              )
            }
          >
            Shearography Hold
          </button>
        </li>

        {/* ===================================================
            BUFFING HOLD
        ==================================================== */}
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === "buffing"
                ? "active"
                : ""
              }`}
            onClick={() =>
              handleTabChange("buffing")
            }
          >
            Buffing Hold
          </button>
        </li>

      </ul>

      {/* =====================================================
          SEARCH
      ====================================================== */}
      <div className="row mb-3">
        <div className="col-md-10">

          <input
            type="text"
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>
      </div>

      {/* =====================================================
          TABLE / LOADER
      ====================================================== */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: "400px",
          }}
        >
          <RingLoader size={80} />
        </div>
      ) : (
        <HoldTyreIndexPage
          data={filteredHoldTyres}
          onInspect={handleInspect}
        />
      )}

      {/* =====================================================
          APPROVAL MODAL
      ====================================================== */}
      {selectedItem && (
        <HoldTyreApprovalModal
          selectedItem={selectedItem}
          onClose={closeApprovalModal}
          activeTab={activeTab}
          onApproved={loadHoldTyres}
        />
      )}

    </div>
  );
};

export default TyreOnHold;