import { useState } from "react";


import MountingBatchModal from "../components/MountingBatchModal";
// import useEnvelopingBatchModal from "../hooks/useEnvelopingBatchModal";
// import useEnvelopingIndexTable from "../hooks/useEnvelopingIndexTable";
import useMountingIndexTable from "../hooks/useMountingIndexTable";
// import "../style/Enveloping.css";
import "../styles/mounting.css"
// import envelopingServiceApi from "../services/envelopingServiceApi";
import mountingServiceApi from "../service/mountingServiceApi";
import { RingLoader } from "react-spinners";
import MountingTable from "../components/MountingTable";
import useMountingBatchModal from "../hooks/useMountingBatchModal";

// import type { RailType } from "../type/enveloping.type";

const MountingStage = () => {
  /* ===========================
          INDEX DATA
  ============================ */

  const {   
    loading,
    mountingRows,
      setMountingRows,
      fetchMountingOrders,
  } = useMountingIndexTable();
  console.log("mounting Rows", mountingRows);
  /* ===========================
          BATCH DATA
  ============================ */

  const {
    availableRows,
    allocatedRows,
    allocateRail,
    removeFromRail,
    processMounting,
    resetModal,
    rails,
    pipes,
    // selectedRailId,
    // setSelectedRailId,

    fetchApprovedFromPreviousStage,
  } = useMountingBatchModal({
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
  const [processing, setProcessing] = useState(false);

  /* ===========================
          OPEN CREATE BATCH
  ============================ */

  // const handleCreateBatch = () => {
  //   setSelectedRailId(null);

  //   setShowRailTypeModal(true);
  // };

  /* ===========================
          OPEN ENVELOPING BATCH
  ============================ */

  const handleContinueRail = async () => {
    await fetchApprovedFromPreviousStage();

    setShowRailTypeModal(false);

    setShowBatchModal(true);
  };


  const handleProcessEnvelope = async () => {
    if (allocatedRows.length === 0) {
      alert("Please allocate rail locations");
      return;
    }

    // const success = await processEnvelope();

    // if (!success) return;

    await fetchMountingOrders(); // Refresh index table
    setShowBatchModal(false);
    resetModal();

    alert("Envelope Processed Successfully");
  };
  // const handleApprove = async () => {
  //   try {
  //     setProcessing(true);
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

  //     await fetchEnvelopingOrders(); // Refresh table

  //     setSelectedRows([]);

  //     alert("Approved Successfully");
  //   } catch (error: any) {
  //     console.error(error);

  //     alert(
  //       error?.response?.data?.message ||
  //         error?.response?.data ||
  //         "Failed to approve",
  //     );
  //   } finally {
  //     setProcessing(false);
  //   }
  // };
  
  // const handleReject = async () => {
  //   try {
  //     setProcessing(true);
  //     if (selectedRows.length === 0) {
  //       alert("Please select casing");
  //       return;
  //     }

  //     const payload = {
  //       isApproved: false,
  //       rejectionReasonCode: null,
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

  //     await fetchEnvelopingOrders(); // Refresh table

  //     setSelectedRows([]);

  //     alert("Rejected Successfully");
  //   } catch (error: any) {
  //     console.error(error);

  //     alert(
  //       error?.response?.data?.message ||
  //         error?.response?.data ||
  //         "Failed to reject",
  //     );
  //   } finally {
  //     setProcessing(false);
  //   }
  // };
  /* ===========================
          CLOSE RAIL MODAL
  ============================ */

  // const closeRailModal = () => {
  //   setSelectedRailId(null);
  //   setShowRailTypeModal(false);
  // };

  /* ===========================
          CLOSE BATCH MODAL
  ============================ */

  const closeBatchModal = () => {
    resetModal();

    setShowBatchModal(false);
  };

  const handleCreateMountingBatch = async () => {
  await fetchApprovedFromPreviousStage(); // Load modal data

  setShowBatchModal(true);
};

  return (
    <div className="container-fluid box mt-3">
      {/* HEADER */}

      <div
        className=" d-flex justify-content-between"
        style={{ alignItems: "center" }}
      >
        <button className="btn btn-primary p-4 " onClick={handleCreateMountingBatch}>
          <strong>Create Mounting Batch</strong>
        </button>

        <div
          className="d-flex justify-content-center p-2 "
          style={{
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <h3> Mounting Stage </h3>
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

      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
        <MountingTable
          data={mountingRows}       
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      )}

      {/* ACTIONS */}

      <div className="row mt-3">
        <div className="col-md-6">
          <button
            className="btn-approve w-100 border-0"
            // onClick={handleApprove}
            disabled={processing}
          >
            {processing ? "Processing..." : "APPROVED"}
          </button>
        </div>
        <div className="col-md-6">
          <button
            className="btn-reject w-100 border-0"
            style={{ padding: "20px" }}
            // onClick={handleReject}
            disabled={processing}
          >
            {processing ? "Processing..." : "REJECTED"}
          </button>
        </div>
      </div>

      
      {/* ======================================
              ENVELOPING BATCH
      ======================================= */}
      
      <MountingBatchModal
        show={showBatchModal}
        selectedMountingSizeId={null} // or your selected value
        availableRows={availableRows}
        allocatedRows={allocatedRows}
        // allocateMounting={allocateRail}
        removeFromMounting={removeFromRail}
        processMounting={handleProcessEnvelope}
        onClose={closeBatchModal}
      />
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

export default MountingStage;
