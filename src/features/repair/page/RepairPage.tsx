import { useState } from "react";
import { RingLoader } from "react-spinners";

import RepairTable from "../components/RepairTable";
import RepairModal from "../components/RepairModal";

import { useRepair } from "../hooks/useRepair";
import { useRepairModal } from "../hooks/useRepairModal";
import "../style/Repair.css"
import IncidentReportModal from "../../nailInspection/components/IncidentReportModal";
const RepairPage = () => {
  const {
    loading,

    search,
    setSearch,

    filteredData,

    loadOrders,
  } = useRepair();

  const {
    showModal,

    selectedItem,

    loadingModal,

    openModal,

    closeModal,
  } = useRepairModal();

 
  const [showIncidentModal, setShowIncidentModal] =
    useState(false);

  return (
    <div className="container-fluid mt-3">
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No or Pattern..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />
        </div>

        <div className="col-md-2 d-flex justify-content-end">
          <button
            className="btn btn-danger w-100"
            onClick={() =>
              setShowIncidentModal(true)
            }
          >
            Incident Report
          </button>
        </div>
      </div>

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            minHeight: "400px",
          }}
        >
          <RingLoader
            size={80}
            color="#b30815"
          />
        </div>
      ) : (
        <RepairTable
          data={filteredData}
          onInspect={openModal}
        />
      )}

      {loadingModal && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{
            zIndex: 9999,
          }}
        >
          <RingLoader
            size={60}
            color="#b30815"
          />
        </div>
      )}

      {showModal &&
        selectedItem && (
          <RepairModal
            selectedItem={
              selectedItem
            }
            onClose={
              closeModal
            }
            onSuccess={
              loadOrders
            }
          />
        )}

          {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentReportModal
          onClose={() =>
            setShowIncidentModal(
              false
            )
          }
        />
      )}
    </div>
  );
};

export default RepairPage;