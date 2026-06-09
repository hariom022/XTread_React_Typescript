import { useState } from "react";
import nailInspectionService from "../service/nailInspectionService";
import { useNavigate } from "react-router-dom";

import NailInspectionTable from "../components/NailInspectionTable";
import NailInspectionModal from "../components/NailInspectionModal";
import ChecklistModal from "../components/NeilChecklistModel";
import IncidentReportModal from "../components/IncidentReportModal";
import "../styles/NailInspection.css";
import { useNailInspection } from "../hooks/useNailInspection";
import { useNailInspectionModal } from "../hooks/useNailInspectionModel";
import { RingLoader } from "react-spinners";

import { NAIL_VISUAL_CHECKLIST } from "../constants/nailCheckList";

const NailInspectionPage = () => {
  const navigate = useNavigate();
  const {
    loading,
    search,
    setSearch,

    filteredInspections,

    // selectedItem,
    setSelectedItem,

    rejectionReasons,

    checkedItems,
    toggleChecklist,

    isChecklistComplete,
    isAllSelected,

    selectAllChecklist,

    repairs,
    setRepairs,

    newRepair,
    setNewRepair,

    addRepair,

    patchesRemoved,
    setPatchesRemoved,

    puncturesFound,
    setPuncturesFound,

    rejectionReason,
    setRejectionReason,

    openInspection,
    loadOrders,
    resonForRemoval,
    setReasonForRemoval,
    location,
    setLocation,
    damageType,
    setDamageType,
    patchRemovals,
    setPatchRemovals,

    newPatchRemoval,
    setNewPatchRemoval,

    addRemove,
  } = useNailInspection();
  const { showModal, selectedItem, loadingModal, openModal, closeModal } =
    useNailInspectionModal();
  const [showChecklist, setShowChecklist] = useState(false);

  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const openChecklist = () => {
    setShowChecklist(true);
  };

  const closeChecklist = () => {
    setShowChecklist(false);
  };
  const handleApprove = async () => {
    try {
      if (!isChecklistComplete) {
        alert(
          "Please complete all Nail Inspection checklist items before Approval",
        );
        return;
      }

      const payload = {
        orderCasingIds: [selectedItem.id.toString()],

        isApproved: true,

        isPressureTestRequired: false,

        patchesRemoved,

        puncturesFound,

        rejectionReasonCode: null,

        repairOperations: repairs.map((r: any) => ({
          repairType: r.type,
          repairLocation: r.location,
          quantity: 1,
        })),

        removalOperations: patchRemovals.map((item: any) => ({
          reasonForRemoval: item.reasonForRemoval,
          repairLocation: item.location,
        })),
      };

      console.log("Approve Payload", payload);

      await nailInspectionService.handleApprovalRejection(payload);

      alert("Nail Inspection Approved Successfully");

      setSelectedItem(null);

      await loadOrders();
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data || "Failed to approve nail inspection");
    }
  };
  const handleReject = async () => {
    try {
      if (!isChecklistComplete) {
        alert(
          "Please complete all Nail Inspection checklist items before Rejection",
        );
        return;
      }

      if (!rejectionReason) {
        alert("Please select rejection reason");
        return;
      }

      const payload = {
        orderCasingIds: [selectedItem.id.toString()],

        isApproved: false,

        isPressureTestRequired: false,

        patchesRemoved,

        puncturesFound,

        rejectionReasonCode: rejectionReason,

        repairOperations: [],

        removalOperations: [],
      };

      console.log("Reject Payload", payload);

      await nailInspectionService.handleApprovalRejection(payload);

      alert("Nail Inspection Rejected");

      setSelectedItem(null);

      await loadOrders();
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data || "Failed to reject nail inspection");
    }
  };
  const handleApproveWithPressureTest = async () => {
    try {
      if (!isChecklistComplete) {
        alert(
          "Please complete all Nail Inspection checklist items before Approval",
        );
        return;
      }

      const payload = {
        orderCasingIds: [selectedItem.id.toString()],

        isApproved: true,

        isPressureTestRequired: false,

        patchesRemoved,

        puncturesFound,

        rejectionReasonCode: null,

        repairOperations: repairs.map((r: any) => ({
          repairType: r.type,
          repairLocation: r.location,
          quantity: 1,
        })),

        removalOperations: patchRemovals.map((item: any) => ({
          reasonForRemoval: item.reasonForRemoval,
          repairLocation: item.location,
        })),
      };

      console.log("Pressure Test Payload", payload);

      await nailInspectionService.handleApprovalRejection(payload);

      alert("Approved With Pressure Test Successfully");

      setSelectedItem(null);

      navigate("/pressuretest", {
        state: {
          casing: selectedItem.casing,
          serial: selectedItem.serial,
          orderCasingId: selectedItem.id,
        },
      });
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to approve with pressure test",
      );
    }
  };

  const handleHold = () => {
    console.log("Status: HOLD");
    console.log("Casing:", selectedItem?.casing);

    alert("Moved to HOLD – Awaiting Customer Approval");

    setSelectedItem(null);
  };
  // const handleApprove = () => {
  //   console.log("Approve");
  // };

  // const handleReject = () => {
  //   console.log("Reject");
  // };

  // const handleHold = () => {
  //   console.log("Hold");
  // };

  // const handleApproveWithPressureTest = () => {
  //   console.log("Approve With Pressure Test");
  // };

  return (
    <div className="container-fluid mt-3">
      {/* Search + Incident */}
      <div className="row mb-3">
        <div className="col-md-10">
          {/* <i className="bi bi-search"></i> */}

          <input
            type="text"
            className="form-control"
            placeholder="Search by Casing No, Serial No, or Pattern..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2 d-flex justify-content-end">
          <button
            className="btn btn-danger w-100"
            // style={{ height: "48px" }}
            onClick={() => setShowIncidentModal(true)}
          >
            Incident Report
          </button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "400px" }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      ) : (
        <NailInspectionTable data={filteredInspections} onInspect={openModal} />
      )}

      {/* APPROVAL MODAL */}
      {selectedItem && (
        <NailInspectionModal
          onClose={closeModal}
          selectedItem={selectedItem}
          patchesRemoved={patchesRemoved}
          setPatchesRemoved={setPatchesRemoved}
          puncturesFound={puncturesFound}
          setPuncturesFound={setPuncturesFound}
          repairs={repairs}
          setRepairs={setRepairs}
          newRepair={newRepair}
          setNewRepair={setNewRepair}
          addRepair={addRepair}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          rejectionReasons={rejectionReasons}
          openChecklist={openChecklist}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleHold={handleHold}
          handleApproveWithPressureTest={handleApproveWithPressureTest}
          resonForRemoval={resonForRemoval}
          location={location}
          damageType={damageType}
          patchRemovals={patchRemovals}
          setPatchRemovals={setPatchRemovals}
          newPatchRemoval={newPatchRemoval}
          setNewPatchRemoval={setNewPatchRemoval}
          addRemove={addRemove}
        />
      )}

      {/* CHECKLIST MODAL */}
      <ChecklistModal
        show={showChecklist}
        onClose={closeChecklist}
        leftItems={NAIL_VISUAL_CHECKLIST.left}
        rightItems={NAIL_VISUAL_CHECKLIST.right}
        checkedItems={checkedItems}
        isAllSelected={isAllSelected}
        isChecklistComplete={isChecklistComplete}
        toggleChecklist={toggleChecklist}
        handleSelectAll={selectAllChecklist}
        onSave={() => {
          console.log("Checklist Saved", checkedItems);

          setShowChecklist(false);
        }}
      />

      {/* INCIDENT MODAL */}
      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}
    </div>
  );
};

export default NailInspectionPage;
