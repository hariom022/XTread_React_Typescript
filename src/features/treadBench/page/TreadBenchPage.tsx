import React from "react";
import { useMemo, useState, useEffect } from "react";
import { RingLoader } from "react-spinners";
import { useTreadBench } from "../hooks/useTreadBench";
import TreadBenchTable from "../components/TreadBenchTable";
import IncidentReportModal from "../components/IncidentReportModal";
import StockManagementModal from "../components/StockManagementModal";
import TreadBenchInspectionModal from "../components/TreadBenchInspectionModal";
import { useTreadBenchInspectionModal } from "../hooks/useTreadBenchInspectionModal";
const TreadBenchPage = () => {
  const [search, setSearch] = useState("");
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const {
    inspections,
    loading,
    loadTreadBench,
    cementTypes,
    loadCementTypes,
    // selectedItem,
    handleSave,
  } = useTreadBench();

  const { showModal, selectedItem, openModal, closeModal } =
    useTreadBenchInspectionModal();
  useEffect(() => {
    //   loadCementTypes();
    loadTreadBench();
  }, []);
  
  const [showStockModal, setShowStockModal] = useState(false);

  const [wasteForm, setWasteForm] = useState({
    wasteKg: "",
    treadPattern: "",
    width: "",
    cementType: "",
  });
  const [waste, setWaste] = useState<number>(0);

  const [wasteRows, setWasteRows] = useState<any[]>([]);
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

  const resetStockManagement = () => {
  setWasteForm({
    wasteKg: "",
    treadPattern: "",
    width: "",
    cementType: "",
  });

  setWasteRows([]);
  setWaste(0);
};
const handleCloseStockModal = () => {
  resetStockManagement();
  setShowStockModal(false);
};
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

        <div className="col-md-2 d-flex justify-content-end">
          <button
            className="btn btn-success w-100"
            style={{
              height: "44px",
              backgroundColor: "blue",
              borderColor: "blue",
            }}
            onClick={() => setShowStockModal(true)}
          >
            Stock Management
          </button>
        </div>

        <div className="col-md-2 d-flex justify-content-end">
          <button
            className="btn btn-danger w-100"
            style={{ height: "44px" }}
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
        <TreadBenchTable data={filteredData} onInspect={openModal} />
      )}

      {/* Inspecton Modal */}
      {showModal && (
        <TreadBenchInspectionModal
          selectedItem={selectedItem}
          staffName="John"
          cementTypes={cementTypes}
          loadCementTypes={loadCementTypes}
          handleSave={handleSave}
          onClose={closeModal}
        />
      )}
      {/* Incident Modal */}
      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}

      {showStockModal && (
        <StockManagementModal
          wasteForm={wasteForm}
          setWasteForm={setWasteForm}
          wasteRows={wasteRows}
          setWasteRows={setWasteRows}
          setWaste={setWaste}
           onClose={handleCloseStockModal}
        />
      )}
    </div>
  );
};

export default TreadBenchPage;
