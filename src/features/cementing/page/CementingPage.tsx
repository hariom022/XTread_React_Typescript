import { RingLoader } from "react-spinners";
import { useEffect, useMemo, useState } from "react";

import CementingTable from "../components/CementingTable";
import CementingModal from "../components/CementingModal";
import IncidentReportModal from "../components/IncidentReportModal";
import StockManagementModal from "../components/StockManagementModal";
import {useCementingInspectionModal} from "../hooks/useCementingInspectionModal"
import { useCementing } from "../hooks/useCementing";

export const CementingPage = () => {
  const {
    inspections,
    loading,
    loadCementing,
    openingStockKg,
    setOpeningStockKg,
    closingStockKg,
    setClosingStockKg,
    cementType,
    setCementType,
    cementTypes,
  loadCementTypes,
  handleSave,
  handleApprove,
    // selectedItem,
  } = useCementing();

  const {
  showModal,
  selectedItem:modalItem,
  // loadingModal,
  openModal,
  closeModal,
} = useCementingInspectionModal();

  const [search, setSearch] = useState("");
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const [showStockModal, setShowStockModal] = useState(false);

  useEffect(() => {
    loadCementTypes();
    loadCementing();
  }, []);

  const filteredData = useMemo(() => {
    return inspections.filter((item: any) =>
      `${item.casing}
       ${item.serial}
       ${item.patternName}
       ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [inspections, search]);

  return (
    <div className="container-fluid mt-3">
      {/* Search + Buttons */}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-primary w-100"
            onClick={() => setShowStockModal(true)}
          >
            Stock Management
          </button>
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-danger w-100"
            onClick={() => setShowIncidentModal(true)}
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
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
        <CementingTable data={filteredData}
        onInspect={openModal}
         />
        
      )}

      {/* Cementing Modal */}
     {showModal && modalItem && (
  <CementingModal
    selectedItem={modalItem}
    staffName="John"
    cementType={cementType}
    setCementType={setCementType}
    cementTypes={cementTypes}
    handleSave={handleSave}
    handleApprove={handleApprove}
    onClose={closeModal}
  />
)}
      {/* Stock Modal */}
      {showStockModal && (
        <StockManagementModal
          openingStockKg={openingStockKg}
          setOpeningStockKg={setOpeningStockKg}
          closingStockKg={closingStockKg}
          setClosingStockKg={setClosingStockKg}
          onClose={() => setShowStockModal(false)}
        />
      )}

      {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}
    </div>
  );
};
