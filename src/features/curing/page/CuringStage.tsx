import { useMemo, useState, useEffect } from "react";

import CuringTable from "../components/CuringTable";

import CuringBatchModal from "../components/CuringBatchModal";
import AutoclaveModal from "../components/AutoclaveModal";
import useCuringBatchModal from "../hooks/useCuringBatchModal";
import useCuringIndexTable from "../hooks/useCuringIndexTable";
import curingServiceApi from "../service/curingServiceApi";
import "../style/curing.css";
import { RingLoader } from "react-spinners";

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
  const { curingRows, setCuringRows, loadData, loading } =
    useCuringIndexTable(statusTab);

  useEffect(() => {
    setSelectedRows([]);
  }, [statusTab]);
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
    rejectionReasons,

    resetModal,
  } = useCuringBatchModal({
    refreshTable: () => {},
  });
  /*  ==================
          Loader
    =======================*/
  const [processing, setProcessing] = useState(false);
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

  // const filteredRows = useMemo(() => {
  //   return curingRows.filter((x: any) => {
  //     const matchesSearch =
  //       x.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       x.tyreReferenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

  //     const matchesStatus = Number(x.currentStageStatus) === Number(statusTab);

  //     return matchesSearch && matchesStatus;
  //   });
  // }, [curingRows, searchTerm, statusTab]);
  const filteredRows = useMemo(() => {
    return curingRows.filter((x: any) => {
      const matchesSearch =
        x.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        x.tyreReferenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = Number(x.currentStageStatus) === Number(statusTab);

      const selectedAutoclaveId = activeAutoclaveTab === "Marangoni" ? 1 : 2;

      const matchesAutoclave = Number(x.autoclaveId) === selectedAutoclaveId;

      return matchesSearch && matchesStatus && matchesAutoclave;
    });
  }, [curingRows, searchTerm, statusTab, activeAutoclaveTab]);

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
      setProcessing(true);
      const payload = {
        orderCasingIds: selectedRows.map(String),
      };

      console.log("START CURE PAYLOAD", payload);

      const response = await curingServiceApi.startCure(payload);
      await loadData();
      setSelectedRows([]);
      console.log("START CURE RESPONSE", response);

      alert("Start Cure Successful");
    } catch (error) {
      console.error("START CURE ERROR", error);
      alert("Failed to Start Cure");
    } finally {
      setProcessing(false);
    }
  };

  const handleUnloadCure = async () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        orderCasingIds: selectedRows.map(String),
      };

      console.log("UNLOAD CURE PAYLOAD", payload);

      await curingServiceApi.unloadCure(payload);
      // await handleSendToEnvelope();
      alert("Unload Cure Successful");
    } catch (error) {
      console.error(error);

      alert("Failed to Unload Cure");
    } finally {
      setProcessing(false);
    }
  };

  const handleFinishCure = async () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        orderCasingIds: selectedRows.map(String),
      };

      console.log("FINISH CURE PAYLOAD", payload);

      await curingServiceApi.finishCure(payload);
      await loadData();
      setSelectedRows([]);

      // setStatusTab(CuringStatus.Unloaded);

      alert("Finish Cure Successful");
    } catch (error) {
      console.error(error);

      alert("Failed to Finish Cure");
    } finally {
      setProcessing(false);
    }
  };

  // const handleCancelCure = async () => {
  //   const current = cancelData[activeAutoclaveTab];

  //   if (
  //     !current?.reason ||
  //     (current.reason === "Other" && !current.other.trim()) ||
  //     !current.comment.trim()
  //   ) {
  //     alert("All fields are required");
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       orderCasingIds: selectedRows.map(String),

  //       // include these only if your API expects them
  //       reason: current.reason === "Other" ? current.other : current.reason,

  //       comment: current.comment,
  //     };

  //     console.log("CANCEL CURE PAYLOAD", payload);

  //     await curingServiceApi.cancelCure(payload);

  //     await loadData();

  //     setSelectedRows([]);

  //     setStatusTab(CuringStatus.Cancelled);

  //     alert("Cancel Cure Successful");

  //     setCancelData((prev) => ({
  //       ...prev,
  //       [activeAutoclaveTab]: {
  //         reason: "",
  //         other: "",
  //         comment: "",
  //       },
  //     }));

  //     setShowCancelModal(false);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to Cancel Cure");
  //   }
  // };
  const handleCancelCure = async () => {
    const current = cancelData[activeAutoclaveTab];

    if (!current?.reason) {
      alert("Please select a cancel reason.");
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        orderCasingIds: selectedRows.map(String),
        rejectionReasonCode: current.reason,
        comment: current.comment,
      };

      console.log("CANCEL CURE PAYLOAD", payload);

      await curingServiceApi.cancelCure(payload);

      await loadData();

      setSelectedRows([]);

      setStatusTab(CuringStatus.Cancelled);

      alert("Cancel Cure Successful");

      setCancelData((prev) => ({
        ...prev,
        [activeAutoclaveTab]: {
          reason: "",
          other: "",
          comment: "",
        },
      }));

      setShowCancelModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to Cancel Cure");
    } finally {
      setProcessing(false);
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
      setProcessing(true);
      const payload = {
        orderCasingIds: selectedRows.map(String),
        destinationStage: 15,
      };

      console.log("SEND TO QA PAYLOAD", payload);

      await curingServiceApi.moveCuring(payload);
      await loadData();
      setSelectedRows([]);
      alert("Sent To QA Successfully");

      setSelectedRows([]);
    } catch (error) {
      console.error(error);

      alert("Failed To Send To QA");
    } finally {
      setProcessing(false);
    }
  };

  const handleSendToEnvelope = async () => {
    if (selectedRows.length === 0) {
      alert("Select casing first");
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        orderCasingIds: selectedRows.map(String),
        destinationStage: 13,
      };

      console.log("SEND TO ENVELOPING PAYLOAD", payload);

      await curingServiceApi.moveCuring(payload);
      await loadData();
      setSelectedRows([]);
      alert("Sent To Enveloping Successfully");

      setSelectedRows([]);
    } catch (error) {
      console.error(error);

      alert("Failed To Send To Enveloping");
    } finally {
      setProcessing(false);
    }
  };

  // ==================== Cancel modal logic =======================

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [cancelData, setCancelData] = useState<{
    [key: string]: {
      reason: string;
      other: string;
      comment: string;
    };
  }>({
    Marangoni: {
      reason: "",
      other: "",
      comment: "",
    },
    Elgi: {
      reason: "",
      other: "",
      comment: "",
    },
  });

  return (
    <div className="container-fluid box">
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
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
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

          <ul className="nav nav-pills mb-4 mt-2">
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

            {/* <li className="nav-item ms-2">
            <button
              className={`nav-link ${statusTab === CuringStatus.Unloaded ? "active" : ""}`}
              onClick={() => setStatusTab(CuringStatus.Unloaded)}
            >
              Finished Cure
            </button>
          </li> */}

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
            <div className="col-md-4">
              <div className="card shadow-sm border-0 curing-card-data">
                <div className="card-body text-center">
                  <h6>Loaded</h6>
                  <h2>
                    {
                      curingRows.filter(
                        (x: any) =>
                          x.currentStageStatus === CuringStatus.Loaded,
                      ).length
                    }
                  </h2>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm border-0 curing-card-data">
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

            {/* <div className="col-md-3">
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
          </div> */}

            <div className="col-md-4">
              <div className="card shadow-sm border-0 curing-card-data">
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
              {/* SEARCH */}

              <div className="d-flex justify-content-end mb-1">
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
                        onClick={() => {
                          if (selectedRows.length === 0) {
                            alert("Select casing first");
                            return;
                          }

                          setShowCancelModal(true);
                        }}
                      >
                        Cancel Cure
                      </button>
                    </>
                  )}

                  {/* {statusTab === CuringStatus.Unloaded && (
                  <button
                    className="btn btn-info w-100"
                    onClick={handleSendToQA}
                  >
                    Send To QC
                  </button>
                )} */}

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
      )}

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

      {showCancelModal && (
        <>
          <div className="custom-modal-backdrop"></div>
          {/* <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
              </div>
            </div>
          </div> */}
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-warning">
                  <h5 className="modal-title">
                    Cancel Cure - {activeAutoclaveTab}
                  </h5>

                  <button
                    className="btn-close"
                    onClick={() => setShowCancelModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Cancel Reason
                    </label>

                    <select
                      className="form-select"
                      value={cancelData[activeAutoclaveTab]?.reason || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        setCancelData((prev) => ({
                          ...prev,
                          [activeAutoclaveTab]: {
                            ...prev[activeAutoclaveTab],
                            reason: value,
                          },
                        }));
                      }}
                    >
                      <option value="">Select Reason</option>

                      {rejectionReasons.map((item) => (
                        <option key={item.rejectionReasonId} value={item.code}>
                          {item.reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* {cancelData[activeAutoclaveTab]?.reason ===
                            "Other" && (
                            <div className="mb-3">
                              <label className="form-label fw-semibold">
                                Specify Reason
                              </label>

                              <input
                                type="text"
                                className="form-control"
                                value={
                                  cancelData[activeAutoclaveTab]?.other || ""
                                }
                                onChange={(e) =>
                                  setCancelData((prev) => ({
                                    ...prev,
                                    [activeAutoclaveTab]: {
                                      ...prev[activeAutoclaveTab],
                                      other: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </div>
                          )} */}

                  <div>
                    <label className="form-label fw-semibold">Comment</label>

                    <textarea
                      className="form-control"
                      rows={4}
                      value={cancelData[activeAutoclaveTab]?.comment || ""}
                      onChange={(e) =>
                        setCancelData((prev) => ({
                          ...prev,
                          [activeAutoclaveTab]: {
                            ...prev[activeAutoclaveTab],
                            comment: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Close
                  </button>

                  <button className="btn btn-danger" onClick={handleCancelCure}>
                    Submit Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {processing && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(255,255,255,0.6)",
            zIndex: 99999,
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      )}
    </div>
  );
};

export default CuringStage;
