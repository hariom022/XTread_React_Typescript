import { useState } from "react";

import RailTypeModal from "../components/RailTypeModal";
import EnvelopingBatchModal from "../components/EnvelopingBatchModal";
import EnvelopingTable from "../components/EnvelopingTable";

import useEnvelopingBatchModal from "../hooks/useEnvelopingBatchModal";
import useEnvelopingIndexTable from "../hooks/useEnvelopingIndexTable";
import "../style/Enveloping.css";
import envelopingServiceApi from "../services/envelopingServiceApi";

// import type { RailType } from "../type/enveloping.type";

const EnvelopingStage = () => {
  /* ===========================
          INDEX DATA
  ============================ */

  const {
    // loading,
    envelopingRows,
    setEnvelopingRows,
    fetchEnvelopingOrders,
  } = useEnvelopingIndexTable();
  console.log("Enveloping Rows", envelopingRows);
  /* ===========================
          BATCH DATA
  ============================ */

  const {
    availableRows,
    allocatedRows,
    allocateRail,
    removeFromRail,
    processEnvelope,
    resetModal,
    loading,
    rails,
    pipes,
    selectedRailId,
    setSelectedRailId,

    fetchApprovedFromPreviousStage,
  } = useEnvelopingBatchModal({
    refreshTable: () => {},
  });

  /* ===========================
          MODALS
  ============================ */

  const [showRailTypeModal, setShowRailTypeModal] = useState(false);

  const [showBatchModal, setShowBatchModal] = useState(false);

  // const [railType, setRailType] = useState<RailType | "">("");

  /* ===========================
          INDEX SELECTION
  ============================ */

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  /* ===========================
          OPEN CREATE BATCH
  ============================ */

  const handleCreateBatch = () => {
    setSelectedRailId(null);

    setShowRailTypeModal(true);
  };

  /* ===========================
          OPEN ENVELOPING BATCH
  ============================ */

  const handleContinueRail = async () => {
    await fetchApprovedFromPreviousStage();

    setShowRailTypeModal(false);

    setShowBatchModal(true);
  };

  /* ===========================
          PROCESS ENVELOPE
  ============================ */

//   const handleProcessEnvelope = async () => {
//   if (allocatedRows.length === 0) {
//     alert("Please allocate rail locations");
//     return;
//   }

//   const responses = await processEnvelope();

//   const processedRows = allocatedRows.map(
//     (row, index) => ({
//       ...row,
//       railId: responses[index]?.data?.railId,
//       railPipeId: responses[index]?.data?.railPipeId,
//     })
//   );

//   setEnvelopingRows((prev) => [
//     ...prev,
//     ...processedRows,
//   ]);

//   setShowBatchModal(false);

//   resetModal();

//   alert(
//     "Envelope Processed Successfully"
//   );
// };
// 
const handleProcessEnvelope = async () => {
  if (allocatedRows.length === 0) {
    alert("Please allocate rail locations");
    return;
  }

  const success = await processEnvelope();

  if (!success) return;

  await fetchEnvelopingOrders(); // Refresh index table
  setShowBatchModal(false);
  resetModal();

  alert("Envelope Processed Successfully");
};
  /* ===========================
          APPROVE
  ============================ */

  // const handleApprove = async () => {
  //   try {
  //     if (selectedRows.length === 0) {
  //       alert("Please select casing");
  //       return;
  //     }

  //     const payload = {
  //       isApproved: true,
  //       rejectionReasonCode: null,
  //       casings: envelopingRows
  //         .filter((row) => selectedRows.includes(row.orderCasingId))
  //         .map((row) => ({
  //           orderCasingId: row.orderCasingId.toString(),

  //           railId: row.railId?.toString() ?? "0",

  //           railPipeId: row.railPipeId?.toString() ?? "0",
  //         })),
  //     };

  //     console.log("Approve Payload", payload);

  //     await envelopingServiceApi.approveRejectEnvelope(payload);

  //     alert("Approved Successfully");

  //     setEnvelopingRows((prev) =>
  //       prev.filter((x) => !selectedRows.includes(x.orderCasingId)),
  //     );

  //     setSelectedRows([]);
  //   } catch (error: any) {
  //     console.error(error);

  //     alert(error?.response?.data || "Failed to approve");
  //   }
  // };
 const handleApprove = async () => {
  try {
    if (selectedRows.length === 0) {
      alert("Please select casing");
      return;
    }

    const payload = {
      isApproved: true,
      rejectionReasonCode: null,
      casings: envelopingRows
        .filter((row) => selectedRows.includes(row.orderCasingId))
        .map((row) => ({
          orderCasingId: row.orderCasingId.toString(),
          railId: row.railId?.toString() ?? "0",
          railPipeId: row.railPipeId?.toString() ?? "0",
        })),
    };

    console.log("Approve Payload", payload);

    await envelopingServiceApi.approveRejectEnvelope(payload);

    await fetchEnvelopingOrders(); // Refresh table

    setSelectedRows([]);

    alert("Approved Successfully");
  } catch (error: any) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
      error?.response?.data ||
      "Failed to approve"
    );
  }
};
  /* ===========================
          REJECT
  ============================ */

  // const handleReject = async () => {
  //   try {
  //     if (selectedRows.length === 0) {
  //       alert("Please select casing");
  //       return;
  //     }

  //     const payload = {
  //       isApproved: false,
  //       rejectionReasonCode: null, // replace with actual reason if required

  //       casings: envelopingRows
  //         .filter((row) => selectedRows.includes(row.orderCasingId))
  //         .map((row) => ({
  //           orderCasingId: row.orderCasingId.toString(),

  //           railId: row.railId?.toString() ?? "0",

  //           railPipeId: row.railPipeId?.toString() ?? "0",
  //         })),
  //     };

  //     console.log("Reject Payload", payload);

  //     await envelopingServiceApi.approveRejectEnvelope(payload);

  //     alert("Rejected Successfully");

  //     setEnvelopingRows((prev) =>
  //       prev.filter((x) => !selectedRows.includes(x.orderCasingId)),
  //     );

  //     setSelectedRows([]);
  //   } catch (error: any) {
  //     console.error(error);

  //     alert(error?.response?.data || "Failed to reject");
  //   }
  // };
const handleReject = async () => {
  try {
    if (selectedRows.length === 0) {
      alert("Please select casing");
      return;
    }

    const payload = {
      isApproved: false,
      rejectionReasonCode: null,
      casings: envelopingRows
        .filter((row) => selectedRows.includes(row.orderCasingId))
        .map((row) => ({
          orderCasingId: row.orderCasingId.toString(),
          railId: row.railId?.toString() ?? "0",
          railPipeId: row.railPipeId?.toString() ?? "0",
        })),
    };

    console.log("Reject Payload", payload);

    await envelopingServiceApi.approveRejectEnvelope(payload);

    await fetchEnvelopingOrders(); // Refresh table

    setSelectedRows([]);

    alert("Rejected Successfully");
  } catch (error: any) {
    console.error(error);

    alert(
      error?.response?.data?.message ||
      error?.response?.data ||
      "Failed to reject"
    );
  }
};
  /* ===========================
          CLOSE RAIL MODAL
  ============================ */

  const closeRailModal = () => {
    setSelectedRailId(null);
    setShowRailTypeModal(false);
  };

  /* ===========================
          CLOSE BATCH MODAL
  ============================ */

  const closeBatchModal = () => {
    resetModal();

    setShowBatchModal(false);
  };

  return (
    <div className="container-fluid box mt-3">
      {/* HEADER */}

      <div
        className=" d-flex justify-content-between"
        style={{ alignItems: "center" }}
      >
        <button className="btn btn-primary p-4 " onClick={handleCreateBatch}>
          <strong>Create Enveloping Batch</strong>
        </button>

        <div
          className="d-flex justify-content-center p-2 "
          style={{
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3> Enveloping Stage </h3>
        </div>
        {/* INCIDENT */}
        <div className="d-flex justify-content-end">
          <button className="btn btn-danger">Incident Report</button>
        </div>
      </div>

      <hr />
      {/* <div className="">
        <h3>
          Enveloping Stage
        </h3>
      </div> */}

      <div className="d-flex justify-content-end mb-3">
        <input
          className="form-control"
          style={{
            width: "260px",
          }}
          placeholder="Search Casing / Serial"
        />
      </div>
      {/* INDEX TABLE */}

      <EnvelopingTable
        data={envelopingRows}
        rails={rails}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />

      {/* ACTIONS */}

      <div className="row mt-3">
        <div className="col-md-6">
          <button
            className="btn-approve w-100 border-0"
            onClick={handleApprove}
          >
            APPROVED
          </button>
        </div>

        <div className="col-md-6">
          <button
            className="btn-reject w-100 border-0"
            style={{ padding: "20px" }}
            onClick={handleReject}
          >
            REJECTED
          </button>
        </div>
      </div>

      {/* ======================================
              SELECT RAIL TYPE
      ======================================= */}

      <RailTypeModal
        show={showRailTypeModal}
        selectedRailId={selectedRailId}
        rails={rails}
        setSelectedRailId={setSelectedRailId}
        onContinue={handleContinueRail}
        onClose={closeRailModal}
      />

      {/* ======================================
              ENVELOPING BATCH
      ======================================= */}

      <EnvelopingBatchModal
        show={showBatchModal}
        selectedRailId={selectedRailId}
        rails={rails}
        pipes={pipes}
        availableRows={availableRows}
        allocatedRows={allocatedRows}
        allocateRail={allocateRail}
        removeFromRail={removeFromRail}
        processEnvelope={handleProcessEnvelope}
        onClose={closeBatchModal}
      />
    </div>
  );
};

export default EnvelopingStage;
