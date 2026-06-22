import { useMemo, useState, useEffect } from "react";

import CuringTable from "../components/CuringTable";

import CuringBatchModal from "../components/CuringBatchModal";
import AutoclaveModal from "../components/AutoclaveModal";
import useCuringBatchModal from "../hooks/useCuringBatchModal";
import useCuringIndexTable from "../hooks/useCuringIndexTable";
import curingServiceApi from "../service/curingServiceApi";
import "../style/curing.css";

const CuringStatus = {
  Pending: 1,
  Approved: 2,
  Hold: 3,
  Rejected: 4,
  InProgress: 5,
  Cancelled: 6,
  Unloaded: 7,
  Loaded: 8,
} as const;

const CuringStage = () => {
  /* =========================
          INDEX DATA
    ========================= */

  const [statusTab, setStatusTab] = useState<number>(CuringStatus.Loaded);
  const { curingRows, setCuringRows, loadData } =
    useCuringIndexTable(statusTab);

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

  /* =========================
          FILTER
    ========================= */

  // const [statusTab, setStatusTab] = useState<number>(CuringStatus.Loaded);

  const filteredRows = useMemo(() => {
    return curingRows.filter((x: any) => {
      const matchesSearch =
        x.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        x.tyreReferenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = Number(x.currentStageStatus) === Number(statusTab);

      return matchesSearch && matchesStatus;
    });
  }, [curingRows, searchTerm, statusTab]);

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
      const payload = {
        orderCasingIds: selectedRows.map(String),
      };

      console.log("START CURE PAYLOAD", payload);

      const response = await curingServiceApi.startCure(payload);
      await loadData();

      console.log("START CURE RESPONSE", response);

      alert("Start Cure Successful");
    } catch (error) {
      console.error("START CURE ERROR", error);
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
      await handleSendToEnvelope();
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
      setStatusTab(CuringStatus.Unloaded);

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
      await loadData();
      setStatusTab(CuringStatus.Cancelled);
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
      await loadData();
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
      await loadData();
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

        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${statusTab === CuringStatus.Loaded ? "active" : ""}`}
              onClick={() => setStatusTab(CuringStatus.Loaded)}
            >
              Ready To Start
            </button>
          </li>

          <li className="nav-item ms-2">
            <button
              className={`nav-link ${
                statusTab === CuringStatus.InProgress ? "active" : ""
              }`}
              onClick={() => setStatusTab(CuringStatus.InProgress)}
            >
              Cure In Progress
            </button>
          </li>

          <li className="nav-item ms-2">
            <button
              className={`nav-link ${statusTab === CuringStatus.Unloaded ? "active" : ""}`}
              onClick={() => setStatusTab(CuringStatus.Unloaded)}
            >
              Finished Cure
            </button>
          </li>

          <li className="nav-item ms-2">
            <button
              className={`nav-link ${
                statusTab === CuringStatus.Cancelled ? "active" : ""
              }`}
              onClick={() => setStatusTab(CuringStatus.Cancelled)}
            >
              Cancelled Cure
            </button>
          </li>
        </ul>

        {/* TABLE */}

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h6>Loaded</h6>
                <h2>
                  {
                    curingRows.filter(
                      (x: any) => x.currentStageStatus === CuringStatus.Loaded,
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h6>Running</h6>
                <h2>
                  {
                    curingRows.filter(
                      (x: any) =>
                        x.currentStageStatus === CuringStatus.InProgress,
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h6>Finished</h6>
                <h2>
                  {
                    curingRows.filter(
                      (x: any) =>
                        x.currentStageStatus === CuringStatus.Cancelled,
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h6>Cancelled</h6>
                <h2>
                  {
                    curingRows.filter(
                      (x: any) =>
                        x.currentStageStatus === CuringStatus.Cancelled,
                    ).length
                  }
                </h2>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="card mb-4 shadow-sm">
          <div className="card-body text-center">
            <h5 className="mb-4">Curing Workflow</h5>

            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
              <span className="badge bg-secondary p-3">Enveloping</span>➜
              <span className="badge bg-primary p-3">Loaded</span>➜
              <span className="badge bg-warning text-dark p-3">Running</span>➜
              <span className="badge bg-success p-3">Finished</span>➜
              <span className="badge bg-info p-3">QC</span>
            </div>
          </div>
        </div> */}
        <div className="row">
          <div className="col-lg-9">
            <CuringTable
              data={filteredRows}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
            />
          </div>

          <div className="col-lg-3">
            <div className="card shadow-sm">
              <div className="card-header">Actions</div>

              <div className="card-body">
                <h6>Selected: {selectedRows.length}</h6>

                <hr />

                {statusTab === CuringStatus.Loaded && (
                  <>
                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={handleStartCure}
                    >
                      Start Cure
                    </button>

                    <button
                      className="btn btn-danger w-100"
                      onClick={handleUnloadCure}
                    >
                      Unload Cure
                    </button>
                  </>
                )}

                {statusTab === CuringStatus.InProgress && (
                  <>
                    <button
                      className="btn btn-primary w-100 mb-2"
                      onClick={handleFinishCure}
                    >
                      Finish Cure
                    </button>

                    <button
                      className="btn btn-warning w-100"
                      onClick={handleCancelCure}
                    >
                      Cancel Cure
                    </button>
                  </>
                )}

                {statusTab === CuringStatus.Unloaded && (
                  <button
                    className="btn btn-info w-100"
                    onClick={handleSendToQA}
                  >
                    Send To QC
                  </button>
                )}

                {statusTab === CuringStatus.Cancelled && (
                  <>
                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={handleSendToQA}
                    >
                      Send To QC
                    </button>

                    <button
                      className="btn btn-secondary w-100"
                      onClick={handleSendToEnvelope}
                    >
                      Send To Enveloping
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
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
