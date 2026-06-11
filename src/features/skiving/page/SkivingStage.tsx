import { useMemo, useRef, useState } from "react";
import { Modal } from "bootstrap";

import SkivingStage1Table from "../components/SkivingStage1Table";
import SkivingApprovalTable from "../components/SkivingApprovalTable";

import SkivingStage1Modal from "../components/SkivingStage1Modal";
import SkivingApprovalModal from "../components/SkivingApprovalModal";

import useSkivingStage1Table from "../hooks/useSkivingStage1IndexTable";
import useSkivingApprovalTable from "../hooks/useSkivingApprovalIndexTable";

import useSkivingStage1Modal from "../hooks/useSkivingStage1Modal";
import useSkivingApprovalModal from "../hooks/useSkivingApprovalModal";

import type { SkivingStage1Row } from "../types/skivingStage1.types";
import type { SkivingApprovalRow } from "../types/skivingApproval.types";
import IncidentReportModal from "../../../shared/components/IncidentReportModal";

import "../style/skivingStage.css";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const SkivingStage = () => {
  const [activeTab, setActiveTab] =
    useState<"stage1" | "approval">(
      "stage1",
    );
  const [search, setSearch] = useState("");

  const [showIncidentModal, setShowIncidentModal] =
    useState(false);
  /* =====================================
      SELECTED ROWS
  ====================================== */

  const [
    selectedStage1Item,
    setSelectedStage1Item,
  ] =
    useState<SkivingStage1Row | null>(
      null,
    );

  const [
    selectedApprovalItem,
    setSelectedApprovalItem,
  ] =
    useState<SkivingApprovalRow | null>(
      null,
    );

  /* =====================================
      MODAL REFS
  ====================================== */

  const stage1ModalRef =
    useRef<HTMLDivElement>(null);

  const approvalModalRef =
    useRef<HTMLDivElement>(null);

  /* =====================================
      TABLE HOOKS
  ====================================== */

  const {
    filteredData:
    skivingStage1Rows,

    fetchSkivingStage1Orders,
  } =
    useSkivingStage1Table();

  const {
    filteredData:
    skivingApprovalRows,

    fetchSkivingApprovalOrders,
  } =
    useSkivingApprovalTable();

  /* =====================================
      STAGE 1 MODAL HOOK
  ====================================== */

  const stage1Modal =
    useSkivingStage1Modal({
      selectedItem:
        selectedStage1Item,

      refreshTable: () => {
        fetchSkivingStage1Orders();
        fetchSkivingApprovalOrders();
      },
    });

  /* =====================================
      APPROVAL MODAL HOOK
  ====================================== */

  const approvalModal =
    useSkivingApprovalModal({
      selectedItem:
        selectedApprovalItem,

      refreshTable:
        fetchSkivingApprovalOrders,
    });

  /* =====================================
      OPEN STAGE1 MODAL
  ====================================== */
  const openStage1Modal = async (
    item: SkivingStage1Row,
  ) => {
    try {
      const response =
        await indexPageApiService.getOrderCasingDetails(
          item.id,
        );

      console.log(
        "CASING DETAILS",
        response.data,
      );

      const casing =
        response.data;

      const updatedItem: SkivingStage1Row =
      {
        ...item,

        casing:
          casing.productionNumber ||
          "-",

        serial:
          casing.tyreReferenceNumber ||
          "-",

        customerName:
          casing.customerName ||
          "-",

        tyreSize:
          casing.tyreSize
            ?.casingSize ||
          "-",

        requestedPattern:
          casing.retreadDetail
            ?.patternName ||
          "-",

        reApprovedPattern:
          // casing.retreadDetail
          //   ?.patternName ||
          "-",

        damageLevel:
          casing.damageLevelId === 1
            ? "Normal"
            : casing.damageLevelId ===
              2
              ? "Heavy"
              : "-",

        inspectionRepairs:
          casing.repairDetail?.operations?.map(
            (op: any) => ({
              location:
                op.repairLocation,

              type:
                op.repairType,

              foundAt:
                "Nail Inspection",
            }),
          ) || [],
      };

      setSelectedStage1Item(
        updatedItem,
      );

      stage1Modal.loadInspectionData(
        updatedItem.inspectionRepairs,
      );

      setTimeout(() => {
        if (stage1ModalRef.current) {
          new Modal(
            stage1ModalRef.current,
          ).show();
        }
      }, 0);
    } catch (error) {
      console.error(
        "Failed to fetch casing details",
        error,
      );

      alert(
        "Unable to load casing details",
      );
    }
  };

  /* =====================================
      OPEN APPROVAL MODAL
  ====================================== */

  const openApprovalModal = async (
    item: SkivingApprovalRow,
  ) => {
    try {
      const response =
        await indexPageApiService.getOrderCasingDetails(
          item.id,
        );

      const casing =
        response.data;

      const updatedItem: SkivingApprovalRow =
      {
        ...item,

        casing:
          casing.productionNumber ||
          "-",

        serial:
          casing.tyreReferenceNumber ||
          "-",

        customerName:
          casing.customerName ||
          "-",

        tyreSize:
          casing.tyreSize
            ?.casingSize ||
          "-",

        requestedPattern:
          casing.retreadDetail
            ?.patternName ||
          "-",

        reApprovedPattern:
          "-",

        damageLevel:
          casing.damageLevelId === 1
            ? "Normal"
            : casing.damageLevelId === 2
              ? "Heavy"
              : "-",

        repairOperations:
          casing.repairDetail
            ?.operations || [],
      };

      setSelectedApprovalItem(
        updatedItem,
      );
      setTimeout(() => {
        if (
          approvalModalRef.current
        ) {
          new Modal(
            approvalModalRef.current,
          ).show();
        }
      }, 0);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to load casing details",
      );
    }
  };

  /* =====================================
      CLOSE STAGE1 MODAL
  ====================================== */
  const closeStage1Modal = () => {
    stage1Modal.resetModal();

    setSelectedStage1Item(null);
  };

  /* =====================================
      CLOSE APPROVAL MODAL
  ====================================== */
  const closeApprovalModal = () => {
    approvalModal.resetModal();

    setSelectedApprovalItem(null);
  };

  /**SEARCH BY FILTERING */
  const filteredStage1Rows = useMemo(() => {
    return skivingStage1Rows.filter(
      (item) =>
        `${item.casing}
       ${item.serial}
       ${item.patternName}
       ${item.customerName}
       ${item.batchNo}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [search, skivingStage1Rows]);

  const filteredApprovalRows = useMemo(() => {
    return skivingApprovalRows.filter(
      (item) =>
        `${item.casing}
       ${item.serial}
       ${item.patternName}
       ${item.customerName}
       ${item.batchNo}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    );
  }, [search, skivingApprovalRows]);

  return (
    <div className="container-fluid">
      <div className="row mb-3">

        <div className="col-md-10">

          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="col-md-2 d-flex justify-content-end">

          <button
            className="btn btn-danger w-100"
            onClick={() =>
              setShowIncidentModal(true)
            }
          >
            Incident Report
          </button>

        </div>

      </div>

      {/* =====================================
          TABS
      ====================================== */}

      <div className="d-flex gap-2 mb-3">

        <button
          className={`btn ${activeTab ===
            "stage1"
            ? "btn-primary"
            : "btn-outline-primary"
            }`}
          onClick={() =>
            setActiveTab(
              "stage1",
            )
          }
        >
          SKIVING STAGE 1
        </button>

        <button
          className={`btn ${activeTab ===
            "approval"
            ? "btn-primary"
            : "btn-outline-primary"
            }`}
          onClick={() =>
            setActiveTab(
              "approval",
            )
          }
        >
          SKIVING APPROVAL
        </button>

      </div>

      {/* =====================================
          STAGE 1 TABLE
      ====================================== */}

      {activeTab ===
        "stage1" && (
          <SkivingStage1Table
            data={
              filteredStage1Rows
            }
            onApprove={
              openStage1Modal
            }
          />
        )}

      {/* =====================================
          APPROVAL TABLE
      ====================================== */}

      {activeTab ===
        "approval" && (
          <SkivingApprovalTable
            data={
              filteredApprovalRows
            }
            onApprove={
              openApprovalModal
            }
          />
        )}

      {/* =====================================
          STAGE 1 MODAL
      ====================================== */}

      {selectedStage1Item && (
        <SkivingStage1Modal
          modalRef={stage1ModalRef}
          selectedItem={selectedStage1Item}

          machines={stage1Modal.machines}

          damageTypes={stage1Modal.damageTypes}
          repairLocations={stage1Modal.repairLocations}
          skivingStation={
            stage1Modal.skivingStation
          }

          setSkivingStation={
            stage1Modal.setSkivingStation
          }

          remarks={
            stage1Modal.remarks
          }

          setRemarks={
            stage1Modal.setRemarks
          }

          inspectionData={
            stage1Modal.inspectionData
          }

          skivingRepairs={
            stage1Modal.skivingRepairs
          }

          setSkivingRepairs={
            stage1Modal.setSkivingRepairs
          }

          newRepair={
            stage1Modal.newRepair
          }

          setNewRepair={
            stage1Modal.setNewRepair
          }

          addRepair={
            stage1Modal.addRepair
          }

          removeRepair={
            stage1Modal.removeRepair
          }

          handleSave={
            stage1Modal.handleSave
          }

          resetModal={closeStage1Modal}
        />
      )}

      {/* =====================================
          APPROVAL MODAL
      ====================================== */}

      {selectedApprovalItem && (
        <SkivingApprovalModal
          modalRef={
            approvalModalRef
          }
          selectedItem={
            selectedApprovalItem
          }
          {...approvalModal}

          resetModal={closeApprovalModal}
        />
      )}

      {/* INCIDENT MODAL POP UP */}
      {showIncidentModal && (
        <IncidentReportModal
          onClose={() =>
            setShowIncidentModal(false)
          }
        />
      )}
    </div>
  );
};

export default SkivingStage;