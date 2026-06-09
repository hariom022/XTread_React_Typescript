import { useState, useMemo } from "react";
import { RingLoader } from "react-spinners";
import StockManagementModal
from "../components/StockManagementModal";
import { useCementing } from "../hooks/useCementing";
import { useCementingModal } from "../hooks/useCementingModal";

import CementingTable from "../components/CementingTable";
import CementingModal from "../components/CementingModal";

import IncidentReportModal from "../../../shared/components/IncidentReportModal";

import "../styles/Cementing.css";

const CementingPage = () => {
  const {
    loading,
    inspections,
    loadCementing,
  } = useCementing();

  const [search, setSearch] = useState("");

  const [showIncidentModal, setShowIncidentModal] =
    useState(false);
const [showStockModal, setShowStockModal] = useState(false);
  const {
    showModal,
    selectedItem,
    loadingModal,
    openModal,
    closeModal,
  } = useCementingModal();

  const filteredData = useMemo(() => {
    return inspections.filter((item: any) =>
      `${item.casing}
       ${item.serial}
       ${item.patternName}
       ${item.batchNo}`
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
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>
<div className="col-md-2 d-flex gap-2">

  <button
    className="btn btn-danger w-50"
    onClick={() =>
      setShowStockModal(true)
    }
  >
    Stock Management
  </button>

  <button
    className="btn btn-danger w-50"
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
        <CementingTable
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

      {/* Cementing Modal */}

      {showModal && selectedItem && (
        <CementingModal
          item={selectedItem}
          onClose={closeModal}
          onSuccess={loadCementing}
        />
      )}

{/* Stock Management */}
{showStockModal && (
  <StockManagementModal
    onClose={() =>
      setShowStockModal(false)
    }
  />
)}
      {/* Incident */}

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

export default CementingPage;