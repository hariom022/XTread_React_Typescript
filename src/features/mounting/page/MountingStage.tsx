import { useState } from "react";

import MountingBatchModal from "../components/MountingBatchModal";
import useMountingIndexTable from "../hooks/useMountingIndexTable";
import "../styles/mounting.css";
import mountingServiceApi from "../service/mountingServiceApi";
import { RingLoader } from "react-spinners";
import MountingTable from "../components/MountingTable";
import useMountingBatchModal from "../hooks/useMountingBatchModal";

const MountingStage = () => {
  /* =====================================================
        INDEX DATA
  ===================================================== */

  const {
    loading,
    mountingRows,
    fetchMountingOrders,
  } = useMountingIndexTable();

  console.log("Mounting Rows:", mountingRows);

  /* =====================================================
        BATCH DATA
  ===================================================== */

  const {
    availableRows,
    allocatedRows,
    allocateMounting,
    removeFromMounting,
    processMounting,
    resetModal,
    fetchApprovedFromPreviousStage,
  } = useMountingBatchModal({
    refreshTable: fetchMountingOrders,
  });

  /* =====================================================
        MODAL
  ===================================================== */

  const [showBatchModal, setShowBatchModal] =
    useState(false);

  /* =====================================================
        INDEX TABLE SELECTION
  ===================================================== */

  const [selectedRows, setSelectedRows] =
    useState<number[]>([]);

  const [processing, setProcessing] =
    useState(false);

  /* =====================================================
        CREATE MOUNTING BATCH
  ===================================================== */

  const handleCreateMountingBatch = async () => {
    await fetchApprovedFromPreviousStage();

    setShowBatchModal(true);
  };

  /* =====================================================
        PROCESS MOUNTING
  ===================================================== */

  const handleProcessMounting = async () => {
    if (allocatedRows.length === 0) {
      alert("Please select a casing");
      return;
    }

    const success = await processMounting();

    if (!success) {
      return;
    }

    await fetchMountingOrders();

    setShowBatchModal(false);

    resetModal();

    alert("Mounting Processed Successfully");
  };

  /* =====================================================
        CLOSE MOUNTING MODAL
  ===================================================== */

  const closeBatchModal = () => {
    resetModal();

    setShowBatchModal(false);
  };

  /* =====================================================
        APPROVE MOUNTING
  ===================================================== */

  const handleApprove = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one casing");
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        isApproved: true,
        rejectionReasonId: null,
        orderCasingIds: selectedRows,
      };

      console.log(
        "Approve Mounting Payload:",
        payload
      );

      const response =
        await mountingServiceApi.approveRejectMounting(
          payload
        );

      console.log(
        "Approve Mounting Response:",
        response.data
      );

      await fetchMountingOrders();

      setSelectedRows([]);

      alert("Mounting Approved Successfully");
    } catch (error: any) {
      console.error(
        "Approve Mounting Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data
            ? JSON.stringify(
                error.response.data
              )
            : null) ||
        error?.message ||
        "Failed to approve mounting";

      alert(message);
    } finally {
      setProcessing(false);
    }
  };

  /* =====================================================
        REJECT MOUNTING
  ===================================================== */

  const handleReject = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one casing");
      return;
    }

    try {
      setProcessing(true);

      const payload = {
        isApproved: false,
        rejectionReasonId: null,
        orderCasingIds: selectedRows,
      };

      console.log(
        "Reject Mounting Payload:",
        payload
      );

      const response =
        await mountingServiceApi.approveRejectMounting(
          payload
        );

      console.log(
        "Reject Mounting Response:",
        response.data
      );

      await fetchMountingOrders();

      setSelectedRows([]);

      alert("Mounting Rejected Successfully");
    } catch (error: any) {
      console.error(
        "Reject Mounting Error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : error?.response?.data
            ? JSON.stringify(
                error.response.data
              )
            : null) ||
        error?.message ||
        "Failed to reject mounting";

      alert(message);
    } finally {
      setProcessing(false);
    }
  };

  /* =====================================================
        UI
  ===================================================== */

  return (
    <div className="container-fluid box mt-3">

      {/* =================================================
            HEADER
      ================================================= */}

      <div
        className="d-flex justify-content-between"
        style={{
          alignItems: "center",
        }}
      >
        {/* CREATE BATCH */}

        <button
          className="btn btn-primary p-4"
          onClick={handleCreateMountingBatch}
          disabled={processing}
        >
          <strong>
            Create Mounting Batch
          </strong>
        </button>

        {/* PAGE TITLE */}

        <div
          className="d-flex justify-content-center p-2"
          style={{
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>Mounting Stage</h3>
        </div>

        {/* INCIDENT */}

        <div className="d-flex justify-content-end">
          <button
            className="btn btn-danger"
            disabled={processing}
          >
            Incident Report
          </button>
        </div>
      </div>

      <hr />

      {/* =================================================
            SEARCH
      ================================================= */}

      <div className="d-flex justify-content-end mb-3">
        <input
          className="form-control"
          style={{
            width: "260px",
          }}
          placeholder="Search Casing / Serial"
        />
      </div>

      {/* =================================================
            INDEX TABLE
      ================================================= */}

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
        <MountingTable
          data={mountingRows}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      )}

      {/* =================================================
            APPROVE / REJECT
      ================================================= */}

      <div className="row mt-3">

        {/* APPROVE */}

        <div className="col-md-6">
          <button
            className="btn-approve w-100 border-0"
            onClick={handleApprove}
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : "APPROVED"}
          </button>
        </div>

        {/* REJECT */}

        <div className="col-md-6">
          <button
            className="btn-reject w-100 border-0"
            style={{
              padding: "20px",
            }}
            onClick={handleReject}
            disabled={processing}
          >
            {processing
              ? "Processing..."
              : "REJECTED"}
          </button>
        </div>

      </div>

      {/* =================================================
            MOUNTING BATCH MODAL
      ================================================= */}

      <MountingBatchModal
        show={showBatchModal}
        selectedMountingSizeId={null}
        availableRows={availableRows}
        allocatedRows={allocatedRows}
        allocateMounting={allocateMounting}
        removeFromMounting={removeFromMounting}
        processMounting={handleProcessMounting}
        onClose={closeBatchModal}
      />

      {/* =================================================
            PROCESSING OVERLAY
      ================================================= */}

      {processing && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "rgba(255,255,255,0.6)",
            zIndex: 99999,
          }}
        >
          <RingLoader
            color="#b30815"
            size={80}
          />
        </div>
      )}

    </div>
  );
};

export default MountingStage;