import { useRef, useState } from "react";

import SkivingStage1IndexTable from "../components/SkivingStage1IndexTable";

import SkivingApprovalIndexTable from "../components/SkivingApprovalIndexTable";

import { useSkivingStage1IndexTable } from "../hooks/useSkivingStage1IndexTable";

import { useSkivingApprovalIndexTable } from "../hooks/useSkivingApprovalIndexTable";

import { useSkivingStage1Modal } from "../hooks/useSkivingStage1Modal";

import { useSkivingApprovalModal } from "../hooks/useSkivingApprovalModal";

import SkivingSubStageTab from "../components/skivingSubStageTab";
import SkivingApprovalModal from "../components/SkivingApprovalModal";

import SkivingStage1Modal from "../components/skivingStage1Modal";
import type { skivingStage1Row } from "../types/skivingStage1Types";
import type { skivingApprovalRow } from "../types/skivingApprovalTypes";


import "../style/skivingStage.css";

const SkivingStage = () => {
    const [activeTab, setActiveTab] =
        useState<"skiving" | "approval">(
            "skiving"
        );

    const [search, setSearch] =
        useState("");

    /*
     * STAGE 1 TABLE
     */
    const {
        filteredSkiving,
        loadSkivingStage1,
    } =
        useSkivingStage1IndexTable(
            search
        );

    /*
     * APPROVAL TABLE
     */
    const {
        filteredApproval,
        loadSkivingApproval,
    } =
        useSkivingApprovalIndexTable(
            search
        );

    /*
     * STAGE 1 MODAL
     */
    const {
        selectedItem,

        machines,

        inspectionData,

        skivingStation,
        setSkivingStation,

        remarks,
        setRemarks,

        skivingRepairs,

        newRepair,
        setNewRepair,

        openModal:
        openStage1Modal,

        resetForm:
        resetStage1Form,

        addRepair,

        deleteRepair,

        handleSave,
        closeModal,
    } =
        useSkivingStage1Modal(
            loadSkivingStage1
        );

    /*
     * APPROVAL MODAL
     */
    const {
        selectedApprovalItem,

        openModal:
        openApprovalModal,

        repeatSkiving,
        setRepeatSkiving,

        skipRepair,
        setSkipRepair,

        rejectionReason,
        setRejectionReason,

        rejectionReasons,

        hasRepairs,

        resetForm:
        resetApprovalForm,

        handleApprove,

        handleReject,
    } =
        useSkivingApprovalModal(
            loadSkivingApproval
        );

    const handleOpenStage1Modal = (
        item: skivingStage1Row
    ) => {
        openStage1Modal(item);

        setTimeout(() => {
            if (
                stage1ModalRef.current &&
                (window as any).bootstrap
            ) {
                const modal =
                    new (
                        window as any
                    ).bootstrap.Modal(
                        stage1ModalRef.current
                    );

                modal.show();
            }
        }, 50);
    };

    const stage1ModalRef =
        useRef<HTMLDivElement>(null);

    const approvalModalRef =
        useRef<HTMLDivElement>(null);

    return (
        <div className="container-fluid p-3">

            {/* SEARCH */}
            <div className="row mb-3">

                <div className="col-md-12">

                    <div className="search-box">
                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Casing No, Serial No, or Pattern"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>

            {/* TABS */}
            <SkivingSubStageTab
                activeTab={
                    activeTab
                }
                setActiveTab={
                    setActiveTab
                }
            />

            {/* STAGE 1 TABLE */}
            {activeTab ===
                "skiving" && (
                    <SkivingStage1IndexTable
                        data={
                            filteredSkiving
                        }
                        onInspect={
                            openStage1Modal
                        }
                    />
                )}

            {/* APPROVAL TABLE */}
            {activeTab ===
                "approval" && (
                    <SkivingApprovalIndexTable
                        data={
                            filteredApproval
                        }
                        onInspect={
                            openApprovalModal
                        }
                    />
                )}

            {/* STAGE 1 MODAL */}
            {selectedItem && (
                <SkivingStage1Modal
                    selectedItem={
                        selectedItem
                    }

                    machines={
                        machines
                    }

                    inspectionData={
                        inspectionData
                    }

                    skivingStation={
                        skivingStation
                    }

                    setSkivingStation={
                        setSkivingStation
                    }

                    remarks={
                        remarks
                    }

                    setRemarks={
                        setRemarks
                    }

                    skivingRepairs={
                        skivingRepairs
                    }

                    newRepair={
                        newRepair
                    }

                    setNewRepair={
                        setNewRepair
                    }

                    addRepair={
                        addRepair
                    }

                    deleteRepair={
                        deleteRepair
                    }

                    handleSave={
                        handleSave
                    }

                    onClose={
                        resetStage1Form
                    }
                />
            )}

            {/* APPROVAL MODAL */}
            {selectedApprovalItem && (
                <SkivingApprovalModal
                    selectedApprovalItem={
                        selectedApprovalItem
                    }

                    repeatSkiving={
                        repeatSkiving
                    }

                    setRepeatSkiving={
                        setRepeatSkiving
                    }

                    skipRepair={
                        skipRepair
                    }

                    setSkipRepair={
                        setSkipRepair
                    }

                    rejectionReason={
                        rejectionReason
                    }

                    setRejectionReason={
                        setRejectionReason
                    }

                    rejectionReasons={
                        rejectionReasons
                    }

                    hasRepairs={
                        hasRepairs
                    }

                    handleApprove={
                        handleApprove
                    }

                    handleReject={
                        handleReject
                    }

                    onClose={
                        resetApprovalForm
                    }
                />
            )}

        </div>
    );
};

export default SkivingStage;