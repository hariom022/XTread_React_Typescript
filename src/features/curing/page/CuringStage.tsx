import { useMemo, useState } from "react";

import CuringTable from "../components/CuringTable";

import CuringBatchModal from "../components/CuringBatchModal";
import AutoclaveModal from "../components/AutoclaveModal";
import useCuringBatchModal from "../hooks/useCuringBatchModal";
import useCuringIndexTable from "../hooks/useCuringIndexTable";
import curingServiceApi from "../service/curingServiceApi";
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
    selectedAutoclave,
    setSelectedAutoclave,

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

  const [activeAutoclaveTab, setActiveAutoclaveTab] =
    useState<string>("Marangoni");

  /* =========================
          SEARCH
    ========================= */

  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
          SELECTION
    ========================= */

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isCureStarted, setIsCureStarted] = useState(false);
  /* =========================
          FILTER
    ========================= */

  const filteredRows = useMemo(() => {
    return curingRows.filter((x: any) => {
      const matchesSearch =
        x.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        x.tyreReferenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAutoclave =
        activeAutoclaveTab === "Marangoni"
          ? x.autoclaveId === 1
          : x.autoclaveId === 2;

      return matchesSearch && matchesAutoclave;
    });
  }, [curingRows, searchTerm, activeAutoclaveTab]);

  /* =========================
          CREATE BATCH
    ========================= */

  const handleCreateBatch = () => {
    setSelectedAutoclave("");
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
    const rowsToLoad = [...allocatedRows];

    console.log("Rows To Load", rowsToLoad);

    await loadCuring();

    setCuringRows((prev) => {
      const updated = [...prev, ...rowsToLoad];

      console.log("Updated Curing Rows", updated);

      return updated;
    });

    setShowBatchModal(false);

    resetModal();
  };

  /* =========================
          APPROVAL ACTIONS
    ========================= */

  const handleStartCure = async () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");
      return;
    }

    try {
      const selectedCasings = curingRows.filter((row) =>
        selectedRows.includes(row.orderCasingId),
      );

      const payload = {
        casings: selectedCasings.map((row) => ({
          orderCasingId: String(row.orderCasingId),
          autoclaveId: String(row.autoclaveId),
          autoclavePipeId: String(row.autoclavePipeId),
        })),
      };

      console.log("START CURE PAYLOAD", payload);

      await curingServiceApi.startCure(payload);
      setIsCureStarted(true);
      alert("Start Cure Successful");
    } catch (error) {
      console.error(error);

      alert("Failed to Start Cure");
    }
  };

  const handleUnloadCure = async () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");
      return;
    }

    try {
      const payload = {
        orderCasingIds: selectedRows.map(String),
      };

      console.log("UNLOAD CURE PAYLOAD", payload);

      await curingServiceApi.unloadCure(payload);

      alert("Unload Cure Successful");
    } catch (error) {
      console.error(error);

      alert("Failed to Unload Cure");
    }
  };

  const handleFinishCure = async () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");
      return;
    }

    try {
      const payload = {
        orderCasingIds: selectedRows.map(String),
      };

      console.log("FINISH CURE PAYLOAD", payload);

      await curingServiceApi.finishCure(payload);

      setIsCureStarted(false);

      alert("Finish Cure Successful");
    } catch (error) {
      console.error(error);

      alert("Failed to Finish Cure");
    }
  };

  const handleCancelCure = async () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");
      return;
    }

    try {
      const payload = {
        orderCasingIds: selectedRows.map(String),
      };

      console.log("CANCEL CURE PAYLOAD", payload);

      await curingServiceApi.cancelCure(payload);

      setIsCureStarted(false);

      alert("Cancel Cure Successful");
    } catch (error) {
      console.error(error);

      alert("Failed to Cancel Cure");
    }
  };

  // const handleSendToQA = () => {
  //   if (selectedRows.length === 0) {
  //     alert("Select casing first");

  //     return;
  //   }

  //   alert("Send To QA API Pending");
  // };

  
  // const handleSendToEnvelope = () => {
  //   if (selectedRows.length === 0) {
  //     alert("Select casing first");

  //     return;
  //   }

  //   alert("Send To Envelope API Pending");
  // };

  const handleSendToQA = async () => {
  if (selectedRows.length === 0) {
    alert("Select casing first");
    return;
  }

  try {
    const payload = {
      orderCasingIds: selectedRows.map(String),
      destinationStage: 15,
    };

    console.log("SEND TO QA PAYLOAD", payload);

    await curingServiceApi.moveCuring(payload);

    alert("Sent To QA Successfully");

    setSelectedRows([]);
  } catch (error) {
    console.error(error);

    alert("Failed To Send To QA");
  }
};

const handleSendToEnvelope = async () => {
  if (selectedRows.length === 0) {
    alert("Select casing first");
    return;
  }

  try {
    const payload = {
      orderCasingIds: selectedRows.map(String),
      destinationStage: 13,
    };

    console.log("SEND TO ENVELOPING PAYLOAD", payload);

    await curingServiceApi.moveCuring(payload);

    alert("Sent To Enveloping Successfully");

    setSelectedRows([]);
  } catch (error) {
    console.error(error);

    alert("Failed To Send To Enveloping");
  }
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
                activeAutoclaveTab === "Marangoni" ? "active" : ""
              }`}
              onClick={() => setActiveAutoclaveTab("Marangoni")}
            >
              <b>Marangoni</b>
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${
                activeAutoclaveTab === "Elgi" ? "active" : ""
              }`}
              onClick={() => setActiveAutoclaveTab("Elgi")}
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
            !isCureStarted ? (
              <>
                <div className="col-md-6">
                  <button
                    className="btn btn-success w-100"
                    style={{ height: "60px" }}
                    onClick={handleStartCure}
                  >
                    Start Cure
                  </button>
                </div>

                <div className="col-md-6">
                  <button
                    className="btn btn-danger w-100"
                    style={{ height: "60px" }}
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
                    className="btn btn-primary w-100"
                    style={{ height: "60px" }}
                    onClick={handleFinishCure}
                  >
                    Finish Cure
                  </button>
                </div>

                <div className="col-md-6">
                  <button
                    className="btn btn-warning w-100"
                    style={{ height: "60px" }}
                    onClick={handleCancelCure}
                  >
                    Cancel Cure
                  </button>
                </div>
              </>
            )
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

      <AutoclaveModal
        show={showChamberModal}
        selectedAutoclave={selectedAutoclave}
        setSelectedAutoclave={setSelectedAutoclave}
        onContinue={handleContinue}
        onClose={() => setShowChamberModal(false)}
      />

      {/* BATCH MODAL */}

      <CuringBatchModal
        show={showBatchModal}
        selectedAutoclave={selectedAutoclave}
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
