import { useMemo, useState } from "react";
import { RingLoader } from "react-spinners";

import { useShearography } from "../hooks/useShearography";
import { useShearographyModal } from "../hooks/useShearographyModal";

import ShearographyTable from "../components/ShearographyTable";
import ShearographyModal from "../components/ShearographyModal";
import IncidentReportModal from "../components/IncidentReportModal";

import "../styles/Shearography.css";

const ShearographyPage = () => {
  const {
    loading,
    inspections,
    rejectionReasons,
    loadOrders,
  } = useShearography();

  const [search, setSearch] = useState("");

  const [showIncidentModal, setShowIncidentModal] =
    useState(false);

  const {
    showModal,
    selectedItem,
    loadingModal,
    openModal,
    closeModal,
  } = useShearographyModal();

  const filteredData = useMemo(() => {
    return inspections.filter((item: any) =>
      `${item.casing}
       ${item.serial}
       ${item.pattern}
       ${item.customerName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [inspections, search]);

  return (
    <div className="container-fluid mt-3">
      {/* Search + Incident */}
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search by Production No, Serial No, Pattern..."
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
          style={{
            minHeight: "400px",
          }}
        >
          <RingLoader
            color="#b30815"
            size={80}
          />
        </div>
      ) : (
        <ShearographyTable
          data={filteredData}
          onInspect={openModal}
        />
      )}

      {/* Modal Loader */}
      {loadingModal && (
        <div
          className="position-fixed top-50 start-50 translate-middle"
          style={{ zIndex: 9999 }}
        >
          <RingLoader
            color="#b30815"
            size={60}
          />
        </div>
      )}

      {/* Approval Modal */}
      {showModal && selectedItem && (
        <ShearographyModal
          item={selectedItem}
          rejectionReasons={
            rejectionReasons
          }
          onClose={closeModal}
          onSuccess={loadOrders}
        />
      )}

      {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentReportModal
          onClose={() =>
            setShowIncidentModal(false)
          }
        />
      )}
    </div>
  );
};

export default ShearographyPage;