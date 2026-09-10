import { useState } from "react";

type Props = {
    selectedItem: any;
    onClose: () => void;
    onApproved: () => Promise<void>;
};

const PreBuffingPatternApprovalModal = ({
    selectedItem,
    onClose,
    onApproved,
}: Props) => {
    const [changeRequestedPattern, setChangeRequestedPattern] =
        useState(true);

    const [selectedPattern, setSelectedPattern] =
        useState("");

    const [selectedWidth, setSelectedWidth] =
        useState("");

    const [selectedBrand, setSelectedBrand] =
        useState("");

    const [comments, setComments] =
        useState("");

    const handleApprove = async () => {
        // Pre-Buffing approval API will go here

        await onApproved();
        onClose();
    };

    const handleReject = () => {
        // Pre-Buffing rejection API will go here
    };

    if (!selectedItem) return null;

    return (
        <>
            {/* BACKDROP */}
            <div className="modal-backdrop fade show"></div>

            {/* MODAL */}
            <div
                className="modal d-block"
                tabIndex={-1}
                aria-modal="true"
                role="dialog"
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content">

                        {/* HEADER */}
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title fw-bold">
                                PRE BUFFING PATTERN CHANGE APPROVAL
                            </h5>

                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            />
                        </div>

                        {/* BODY */}
                        <div className="modal-body">

                            {/* TOP INFORMATION */}
                            <div className="row g-2 mb-3">

                                <div className="col">
                                    <div className="small text-muted fw-bold">
                                        Production No
                                    </div>
                                    <div className="fw-semibold">
                                        {selectedItem?.casing || "-"}
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="small text-muted fw-bold">
                                        Tyre Ref No
                                    </div>
                                    <div className="fw-semibold">
                                        {selectedItem?.serial || "-"}
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="small text-muted fw-bold">
                                        Customer Name
                                    </div>
                                    <div className="fw-semibold">
                                        {selectedItem?.customerName || "-"}
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="small text-muted fw-bold">
                                        Tyre Size
                                    </div>
                                    <div className="fw-semibold">
                                        {selectedItem?.tyreSize || "-"}
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="small text-muted fw-bold">
                                        Requested Pattern
                                    </div>
                                    <div className="fw-semibold">
                                        {selectedItem?.requestedPattern || "-"}
                                    </div>
                                </div>

                            </div>

                            {/* CASING / PATTERN DETAILS */}
                            <div className="row g-2">

                                {/* CASING DETAILS */}
                                <div className="col-md-4">
                                    <div className="card h-100">
                                        <div className="card-header fw-bold">
                                            Casing Details
                                        </div>

                                        <div className="card-body">

                                            <div className="row mb-2">
                                                <div className="col-5 fw-semibold">
                                                    Make
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.tyreMakeName ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-2">
                                                <div className="col-5 fw-semibold">
                                                    Model
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.model ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-5 fw-semibold">
                                                    Casing Size
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.tyreSize ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* CUSTOMER REQUESTED PATTERN */}
                                <div className="col-md-4">
                                    <div className="card h-100">
                                        <div className="card-header fw-bold">
                                            Customer Requested Pattern
                                        </div>

                                        <div className="card-body">

                                            <div className="row mb-2">
                                                <div className="col-5 fw-semibold">
                                                    Brand
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.requestedBrand ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-2">
                                                <div className="col-5 fw-semibold">
                                                    Pattern
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.requestedPattern ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-5 fw-semibold">
                                                    Width
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.requestedWidth ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                {/* TECHNICIAN SUGGESTED PATTERN */}
                                <div className="col-md-4">
                                    <div className="card h-100">
                                        <div className="card-header fw-bold">
                                            Suggested Pattern - Technician
                                        </div>

                                        <div className="card-body">

                                            <div className="row mb-2">
                                                <div className="col-5 fw-semibold">
                                                    Brand
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.suggestedBrand ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-2">
                                                <div className="col-5 fw-semibold">
                                                    Pattern
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.suggestedPattern ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-5 fw-semibold">
                                                    Width
                                                </div>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            selectedItem?.suggestedWidth ||
                                                            ""
                                                        }
                                                        readOnly
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* APPROVED PATTERN CHANGE */}
                            <div className="card mt-3">
                                <div className="card-header fw-bold">
                                    Approved Pattern Change
                                </div>

                                <div className="card-body">

                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={changeRequestedPattern}
                                            onChange={(e) =>
                                                setChangeRequestedPattern(
                                                    e.target.checked
                                                )
                                            }
                                            id="changeRequestedPattern"
                                        />

                                        <label
                                            className="form-check-label fw-bold"
                                            htmlFor="changeRequestedPattern"
                                        >
                                            Change Requested Pattern
                                        </label>
                                    </div>

                                    <div className="row g-3">

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">
                                                Pattern
                                            </label>

                                            <select
                                                className="form-select"
                                                value={selectedPattern}
                                                onChange={(e) =>
                                                    setSelectedPattern(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Pattern
                                                </option>
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">
                                                Width
                                            </label>

                                            <select
                                                className="form-select"
                                                value={selectedWidth}
                                                onChange={(e) =>
                                                    setSelectedWidth(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Width
                                                </option>
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label fw-semibold">
                                                Brand
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedBrand}
                                                onChange={(e) =>
                                                    setSelectedBrand(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* HOLD REASON / COMMENTS */}
                            <div className="row g-3 mt-1">

                                <div className="col-md-5">
                                    <label className="form-label fw-semibold">
                                        Hold Reason
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            selectedItem?.holdReason || ""
                                        }
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-7">
                                    <label className="form-label fw-semibold">
                                        Comments
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        value={comments}
                                        onChange={(e) =>
                                            setComments(e.target.value)
                                        }
                                    />
                                </div>

                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="row g-3 mt-3">

                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100 py-4 fw-bold"
                                        onClick={handleApprove}
                                    >
                                        APPROVED
                                    </button>
                                </div>

                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className="btn btn-reject w-100 py-4 fw-bold"
                                        onClick={handleReject}
                                    >
                                        REJECTED
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PreBuffingPatternApprovalModal;