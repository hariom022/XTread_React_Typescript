import { useMemo, useState } from "react";

import CuringTable from "../components/CuringTable";
import ChamberTypeModal from "../components/ChamberTypeModal";
import CuringBatchModal from "../components/CuringBatchModal";

import useCuringBatchModal from "../hooks/useCuringBatchModal";
import useCuringIndexTable from "../hooks/useCuringIndexTable";
import "../style/curing.css";

const CuringStage = () => {
  /* =========================
          INDEX DATA
    ========================= */

  const { curingRows, setCuringRows } = useCuringIndexTable();

  /* =========================
          BATCH MODAL
    ========================= */

  const {
    chamberType,
    setChamberType,

    availableRows,
    allocatedRows,

    selectedAllocatedRow,
    setSelectedAllocatedRow,

    fetchApprovedFromEnveloping,

    allocatePipe,

    removeFromPipe,

    loadCuring,

    resetModal,
  } = useCuringBatchModal({
    refreshTable: () => {},
  });

  /* =========================
          MODALS
    ========================= */

  const [showChamberModal, setShowChamberModal] = useState(false);

  const [showBatchModal, setShowBatchModal] = useState(false);

  const [showIncidentModal, setShowIncidentModal] = useState(false);

  /* =========================
          TABS
    ========================= */

  const [mainTab, setMainTab] = useState<"CURING" | "CANCEL">("CURING");

  const [activeChamberTab, setActiveChamberTab] = useState<
    "Marangoni" | "Elgi"
  >("Marangoni");

  /* =========================
          SEARCH
    ========================= */

  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
          SELECTION
    ========================= */

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  /* =========================
          FILTER
    ========================= */

  const filteredRows = useMemo(() => {
    return curingRows.filter((x: any) => {
      const matchesSearch =
        x.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        x.tyreReferenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesChamber = !x.chamber || x.chamber === activeChamberTab;

      return matchesSearch && matchesChamber;
    });
  }, [curingRows, searchTerm, activeChamberTab]);

  /* =========================
          CREATE BATCH
    ========================= */

  const handleCreateBatch = () => {
    setChamberType("");

    setShowChamberModal(true);
  };

  const handleContinue = async () => {
    await fetchApprovedFromEnveloping();

    setShowChamberModal(false);

    setShowBatchModal(true);
  };

  /* =========================
          LOAD CURING
    ========================= */

  const handleLoadCuring = async () => {
    await loadCuring();

    setCuringRows((prev) => [...prev, ...allocatedRows]);

    setShowBatchModal(false);

    resetModal();
  };

  /* =========================
          APPROVAL ACTIONS
    ========================= */

  const handleStartCure = () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");

      return;
    }

    alert("Start Cure API Pending");
  };

  const handleUnloadCure = () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");

      return;
    }

    alert("Unload Cure API Pending");
  };

  const handleSendToQA = () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");

      return;
    }

    alert("Send To QA API Pending");
  };

  const handleSendToEnvelope = () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");

      return;
    }

    alert("Send To Envelope API Pending");
  };

  return (
    <div className="container-fluid box mt-3">
      <div
        className="d-flex justify-content-between "
        style={{ alignItems: "center" }}
      >
        <button
          className="btn btn-primary p-4 d-flex justify-content-start "
          onClick={handleCreateBatch}
        >
          <strong>Create Curing Batch</strong>
        </button>

        <div
          className="d-flex justify-content-center p-2 "
          style={{
            border: "2px solid black",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3> Curing Stage </h3>
        </div>
        {/* INCIDENT */}
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger"
            onClick={() => setShowIncidentModal(true)}
          >
            Incident Report
          </button>
        </div>
      </div>
      <hr />

      {/* SEARCH */}

      <div className="d-flex justify-content-end mb-3">
        <input
          className="form-control"
          style={{
            width: "260px",
          }}
          placeholder="Search Casing / Serial"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="col">
        {/* MAIN TAB */}

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${mainTab === "CURING" ? "active" : ""}`}
              onClick={() => setMainTab("CURING")}
            >
              Curing
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${mainTab === "CANCEL" ? "active" : ""}`}
              onClick={() => setMainTab("CANCEL")}
            >
              Cancel Cure
            </button>
          </li>
        </ul>

        {/* CHAMBER TAB */}

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeChamberTab === "Marangoni" ? "active" : ""
              }`}
              onClick={() => setActiveChamberTab("Marangoni")}
            >
              <b>Marangoni</b>
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${
                activeChamberTab === "Elgi" ? "active" : ""
              }`}
              onClick={() => setActiveChamberTab("Elgi")}
            >
              <b>Elgi</b>
            </button>
          </li>
        </ul>

        {/* TABLE */}

        <CuringTable
          data={filteredRows}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />

        {/* BUTTONS */}

        <div className="row mt-4">
          {mainTab === "CURING" ? (
            <>
              <div className="col-md-6">
                <button
                  className="btn btn-success w-100"
                  style={{
                    height: "60px",
                  }}
                  onClick={handleStartCure}
                >
                  Start Cure
                </button>
              </div>

              <div className="col-md-6">
                <button
                  className="btn btn-danger w-100"
                  style={{
                    height: "60px",
                  }}
                  onClick={handleUnloadCure}
                >
                  Unload Cure
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-6">
                <button
                  className="btn btn-success w-100"
                  style={{
                    height: "60px",
                  }}
                  onClick={handleSendToQA}
                >
                  Send To QA
                </button>
              </div>

              <div className="col-md-6">
                <button
                  className="btn btn-primary w-100"
                  style={{
                    height: "60px",
                  }}
                  onClick={handleSendToEnvelope}
                >
                  Send To Enveloping
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CHAMBER MODAL */}

      <ChamberTypeModal
        show={showChamberModal}
        chamberType={chamberType}
        setChamberType={setChamberType}
        onContinue={handleContinue}
        onClose={() => setShowChamberModal(false)}
      />

      {/* BATCH MODAL */}

      <CuringBatchModal
        show={showBatchModal}
        chamberType={chamberType}
        availableRows={availableRows}
        allocatedRows={allocatedRows}
        selectedAllocatedRow={selectedAllocatedRow}
        setSelectedAllocatedRow={setSelectedAllocatedRow}
        allocatePipe={allocatePipe}
        removeFromPipe={removeFromPipe}
        loadCuring={handleLoadCuring}
        onClose={() => {
          resetModal();

          setShowBatchModal(false);
        }}
      />
    </div>
  );
};

export default CuringStage;
