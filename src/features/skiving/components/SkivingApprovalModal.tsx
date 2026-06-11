import React from "react";

import type {
    RejectionReason,
    skivingApprovalRow,
} from "../types/skivingApproval.types";

type Props = {
    selectedApprovalItem: skivingApprovalRow | null;

    repeatSkiving: boolean;
    setRepeatSkiving: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    skipRepair: boolean;
    setSkipRepair: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    rejectionReason: string;
    setRejectionReason: React.Dispatch<
        React.SetStateAction<string>
    >;

    rejectionReasons: RejectionReason[];

    hasRepairs: boolean;

    handleApprove: () => Promise<boolean>;

    handleReject: () => Promise<boolean>;

    onClose: () => void;
};

const SkivingApprovalModal = ({
    selectedApprovalItem,

    repeatSkiving,
    setRepeatSkiving,

    skipRepair,
    setSkipRepair,

    rejectionReason,
    setRejectionReason,

    rejectionReasons,

    hasRepairs,

    handleApprove,

    handleReject,

    onClose,
}: Props) => {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            aria-hidden="true"
            style={{
                backgroundColor:
                    "rgba(0,0,0,0.5)",
            }}
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content">

                    {/* HEADER */}
                    <div className="modal-header skiving-header d-flex align-items-center">
                        <h5 className="modal-title flex-grow-1 text-white">
                            SKIVING APPROVAL
                        </h5>

                        <div className="me-3 text-white text-end">
                            <div>John</div>
                        </div>

                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        />
                    </div>

                    {/* BODY */}
                    <div
                        className="modal-body"
                        style={{
                            overflowX: "hidden",
                        }}
                    >
                        {/* TOP INFO BAR */}
                        <div className="mb-2">
                            <div className="modal-info m-0 p-1 mb-1 postbuff-top row text-nowrap">

                                <div className="col">
                                    <strong>
                                        Production No
                                    </strong>
                                    <div>
                                        {selectedApprovalItem?.casing}
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Serial No
                                    </strong>
                                    <div>
                                        {selectedApprovalItem?.serial}
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Customer Name
                                    </strong>
                                    <div>
                                        {selectedApprovalItem?.customerName}
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Tyre Size
                                    </strong>
                                    <div>
                                        {selectedApprovalItem?.tyreSize}
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Requested Pattern
                                    </strong>
                                    <div>
                                        {selectedApprovalItem?.requestedPattern}
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        ReApproved Pattern
                                    </strong>
                                    <div>
                                        {selectedApprovalItem?.reApprovedPattern}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div
                            className="col-md-12 mb-1"
                            style={{
                                overflowX: "hidden",
                            }}
                        >
                            <div className="row mt-1">

                                {/* LEFT PANEL */}
                                <div className="col-md-8 ps-4">
                                    <div className="panel-box-left p-2">

                                        <div className="col-md-8 mb-2 d-flex align-items-center">
                                            <b className="me-2">
                                                Damage Level:
                                            </b>

                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                style={{
                                                    width: "120px",
                                                }}
                                                value={
                                                    selectedApprovalItem?.damageLevel ||
                                                    ""
                                                }
                                                readOnly
                                            />
                                        </div>

                                        {/* SKIVING DATA TABLE */}
                                        <div className="table-responsive mb-2">
                                            <table className="table table-bordered align-middle">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Type</th>
                                                        <th>Location</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {!selectedApprovalItem
                                                        ?.repairOperations
                                                        ?.length ? (
                                                        <tr>
                                                            <td
                                                                colSpan={2}
                                                                className="text-center text-muted"
                                                            >
                                                                No skiving data available
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        selectedApprovalItem.repairOperations.map(
                                                            (
                                                                row,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={index}
                                                                >
                                                                    <td>
                                                                        {row.repairType}
                                                                    </td>

                                                                    <td>
                                                                        {row.repairLocation}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="d-flex align-items-center justify-content-center">

                                            {/* SKIP REPAIR */}
                                            <div className="form-check mb-2 me-4">

                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="skipRepairCheckbox"
                                                    checked={
                                                        skipRepair
                                                    }
                                                    disabled={
                                                        hasRepairs
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setSkipRepair(
                                                            e.target
                                                                .checked
                                                        )
                                                    }
                                                />

                                                <label
                                                    className={`form-check-label fw-semibold ${hasRepairs
                                                        ? "text-muted"
                                                        : ""
                                                        }`}
                                                    htmlFor="skipRepairCheckbox"
                                                >
                                                    Skip Repair
                                                </label>

                                            </div>

                                            {/* APPROVE */}
                                            <div className="col-md-4">
                                                <button
                                                    className="btn btn-approve d-flex align-items-center justify-content-center"
                                                    onClick={async () => {
                                                        const success =
                                                            await handleApprove();

                                                        if (success) {
                                                            onClose();
                                                        }
                                                    }}
                                                >
                                                    <span>
                                                        APPROVED
                                                    </span>

                                                    <span className="icon-box">
                                                        <i className="bi bi-check-lg"></i>
                                                    </span>
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                {/* RIGHT PANEL */}
                                <div className="col-md-4 pe-4 ps-0">

                                    <div className="panel-box-right p-2">

                                        <p className="fw-semibold text-center mb-3">
                                            Require skiving to
                                            be repeated on the
                                            casing
                                        </p>

                                        <div className="d-flex align-items-center justify-content-center">

                                            <button
                                                className={`btn w-50 d-flex fw-bold text-light align-items-center justify-content-center ${repeatSkiving
                                                    ? "btn-danger"
                                                    : "btn-warning"
                                                    }`}
                                                onClick={() =>
                                                    setRepeatSkiving(
                                                        !repeatSkiving
                                                    )
                                                }
                                            >
                                                Repeat Skiving
                                            </button>

                                        </div>

                                        {/* REJECTION REASON */}
                                        <div className="mb-3 mt-3">

                                            <label className="fw-semibold">
                                                Rejection Reason
                                            </label>

                                            <select
                                                className="form-select mb-3"
                                                value={
                                                    rejectionReason
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setRejectionReason(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    --- Select Reason ---
                                                </option>

                                                {rejectionReasons.map(
                                                    (
                                                        item
                                                    ) => (
                                                        <option
                                                            key={
                                                                item.rejectionReasonId
                                                            }
                                                            value={
                                                                item.code
                                                            }
                                                        >
                                                            {
                                                                item.reason
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                        </div>

                                        {/* REJECT */}
                                        <div className="d-grid col-md-6 mx-auto">

                                            <button
                                                className="btn btn-reject h-75 d-flex align-items-center justify-content-center"
                                                onClick={async () => {
                                                    const success =
                                                        await handleReject();

                                                    if (success) {
                                                        onClose();
                                                    }
                                                }}
                                            >
                                                <span>
                                                    REJECTED
                                                </span>

                                                <span className="icon-box">
                                                    <i className="bi bi-x-lg"></i>
                                                </span>
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default SkivingApprovalModal;