import { useState, useMemo } from "react";
import { RingLoader } from "react-spinners";

import { useVisualInspection } from "../hooks/useVisualInspection";
import { useVisualInspectionModal } from "../hooks/useVisualInspectionModal";

import VisualInspectionTable from "../components/VisualInspectionTable";
import VisualInspectionModal from "../components/VisualInspectionModal";
// import IncidentReportModal from "../components/IncidentReportModal";

import IncidentReportModal from "../../../shared/components/IncidentReportModal";
// import "../styles/VisualInspect.css";

const VisualInspectionPage = () => {
  const {
    loading,
    inspections,
    rejectionReasons,
    loadVisualInspection,
  } = useVisualInspection();

  const [search, setSearch] = useState("");

  const [showIncidentModal, setShowIncidentModal] =
    useState(false);

  const {
    showModal,
    selectedItem,
    loadingModal,
    openModal,
    closeModal,
  } = useVisualInspectionModal();

const filteredData = useMemo(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inspections
    .filter((item: any) =>
      `${item.casing} ${item.serial} ${item.patternName} ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a: any, b: any) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();

      const aDay = new Date(timeA);
      const bDay = new Date(timeB);

      aDay.setHours(0, 0, 0, 0);
      bDay.setHours(0, 0, 0, 0);

      const isTodayA = aDay.getTime() === today.getTime();
      const isTodayB = bDay.getTime() === today.getTime();

      if (isTodayA !== isTodayB) {
        return isTodayA ? -1 : 1;
      }

      return timeB - timeA;
    });
}, [inspections, search]);


  return (
    <div className="container-fluid mt-3">
      {/* Search + Incident */}
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
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

      {/* Main Loader */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <RingLoader
            color="#b30815"
            size={80}
          />
        </div>
      ) : (
        <VisualInspectionTable
          data={filteredData}
          onInspect={openModal}
        />
      )}

      {/* Modal Loader */}
      {loadingModal && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{
            zIndex: 9999,
          }}
        >
          <RingLoader
            color="#b30815"
            size={60}
          />
        </div>
      )}

      {/* Visual Inspection Modal */}
      {showModal && selectedItem && (
        <VisualInspectionModal
          item={selectedItem}
          rejectionReasons={
            rejectionReasons
          }
          onClose={closeModal}
          onSuccess={
            loadVisualInspection
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

export default VisualInspectionPage;