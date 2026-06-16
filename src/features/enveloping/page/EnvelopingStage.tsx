import { useState } from "react";

import RailTypeModal from "../components/RailTypeModal";
import EnvelopingBatchModal from "../components/EnvelopingBatchModal";
import EnvelopingTable from "../components/EnvelopingTable";

import useEnvelopingBatchModal from "../hooks/useEnvelopingBatchModal";
import useEnvelopingIndexTable from "../hooks/useEnvelopingIndexTable";
import "../style/Enveloping.css"

import type {
  RailType,
} from "../type/enveloping.type";

const EnvelopingStage = () => {
  /* ===========================
          INDEX DATA
  ============================ */

  const {
    // loading,
    envelopingRows,
    setEnvelopingRows,
    // fetchEnvelopingOrders,
  } = useEnvelopingIndexTable();

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

    fetchApprovedFromPreviousStage,
  } =
    useEnvelopingBatchModal({
      refreshTable: () => { },
    });

  /* ===========================
          MODALS
  ============================ */

  const [
    showRailTypeModal,
    setShowRailTypeModal,
  ] = useState(false);

  const [
    showBatchModal,
    setShowBatchModal,
  ] = useState(false);

  const [
    railType,
    setRailType,
  ] = useState<RailType | "">("");

  /* ===========================
          INDEX SELECTION
  ============================ */

  const [
    selectedRows,
    setSelectedRows,
  ] = useState<number[]>([]);

  /* ===========================
          OPEN CREATE BATCH
  ============================ */

  const handleCreateBatch =
    () => {
      setRailType("");

      setShowRailTypeModal(
        true,
      );
    };

  /* ===========================
          OPEN ENVELOPING BATCH
  ============================ */

  const handleContinueRail =
    async () => {
      await fetchApprovedFromPreviousStage();

      setShowRailTypeModal(false);

      setShowBatchModal(true);
    };

  /* ===========================
          PROCESS ENVELOPE
  ============================ */

  const handleProcessEnvelope =
    () => {
      if (
        allocatedRows.length === 0
      ) {
        alert(
          "Please allocate rail locations",
        );

        return;
      }
      processEnvelope();
      setShowBatchModal(
        false,
      );
      resetModal();

      alert(
        "Envelope Processed Successfully",
      );
    };

  /* ===========================
          APPROVE
  ============================ */

  const handleApprove =
    async () => {
      if (
        selectedRows.length === 0
      ) {
        alert(
          "Please select casing",
        );

        return;
      }

      /*
      TODO API

      await envelopingApi.approve({
         orderCasingIds:selectedRows
      })
      */

      alert(
        "Approved Successfully",
      );

      setEnvelopingRows((prev) =>
        prev.filter(
          (x) =>
            !selectedRows.includes(
              x.orderCasingId,
            ),
        ),
      );

      setSelectedRows([]);
    };

  /* ===========================
          REJECT
  ============================ */

  const handleReject =
    async () => {
      if (
        selectedRows.length === 0
      ) {
        alert(
          "Please select casing",
        );

        return;
      }

      /*
      TODO API

      await envelopingApi.reject({
         orderCasingIds:selectedRows
      })
      */

      alert(
        "Rejected Successfully",
      );

      setEnvelopingRows((prev) =>
        prev.filter(
          (x) =>
            !selectedRows.includes(
              x.orderCasingId,
            ),
        ),
      );

      setSelectedRows([]);
    };

  /* ===========================
          CLOSE RAIL MODAL
  ============================ */

  const closeRailModal =
    () => {
      setRailType("");

      setShowRailTypeModal(
        false,
      );
    };

  /* ===========================
          CLOSE BATCH MODAL
  ============================ */

  const closeBatchModal =
    () => {
      resetModal();

      setShowBatchModal(
        false,
      );
    };

  return (
    <div className="container-fluid mt-3">
      {/* HEADER */}

      <div className=" d-flex justify-content-start">
        <button
          className="btn btn-primary p-4 "
          style={{backgroundColor:"#f0ce23 !important"}}
          onClick={
            handleCreateBatch
          }
        >
          <strong>Create Enveloping Batch</strong>
        </button>
      </div>
      <div className="">
        <h3>
          Enveloping Stage
        </h3>
      </div>


      {/* INDEX TABLE */}

      <EnvelopingTable
        data={envelopingRows}
        selectedRows={
          selectedRows
        }
        setSelectedRows={
          setSelectedRows
        }
      />

      {/* ACTIONS */}

      <div className="row mt-3">
        <div className="col-md-6">
          <button
            className="btn-approve w-100 border-0"
          >
            APPROVED
          </button>
        </div>

        <div className="col-md-6">
          <button
            className="btn-reject w-100 border-0"
            style={{ padding: "20px" }}
          >
            REJECTED
          </button>
        </div>
      </div>

      {/* ======================================
              SELECT RAIL TYPE
      ======================================= */}

      <RailTypeModal
        show={
          showRailTypeModal
        }
        railType={railType}
        setRailType={
          setRailType
        }
        onContinue={
          handleContinueRail
        }
        onClose={
          closeRailModal
        }
      />

      {/* ======================================
              ENVELOPING BATCH
      ======================================= */}

      <EnvelopingBatchModal
        show={
          showBatchModal
        }
        railType={railType}
        availableRows={
          availableRows
        }
        allocatedRows={
          allocatedRows
        }
        allocateRail={
          allocateRail
        }
        removeFromRail={
          removeFromRail
        }
        processEnvelope={
          handleProcessEnvelope
        }
        onClose={
          closeBatchModal
        }
      />
    </div>
  );
};

export default EnvelopingStage;