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
                        <div className="modal-header bg-approve text-white">
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
                            <div>

                                {/* TOP INFO */}
                                <div className="modal-info m-0 row text-nowrap">
                                    <div className="col">
                                        <strong>Production No</strong>
                                        <div>{selectedItem?.casing || "-"}</div>
                                    </div>

                                    <div className="col">
                                        <strong>Tyre Ref No</strong>
                                        <div>{selectedItem?.serial || "-"}</div>
                                    </div>

                                    <div className="col">
                                        <strong>Customer Name</strong>
                                        <div>{selectedItem?.customerName || "-"}</div>
                                    </div>

                                    <div className="col">
                                        <strong>Tyre Size</strong>
                                        <div>{selectedItem?.tyreSize || "-"}</div>
                                    </div>

                                    <div className="col">
                                        <strong>Requested Pattern</strong>
                                        <div>{selectedItem?.requestedPattern || "-"}</div>
                                    </div>
                                </div>

                                {/* CASING / PATTERN DETAILS */}
                                <div className="row g-2 mt-1">

                                    {/* CASING DETAILS */}
                                    <div className="col-md-4">
                                        <div className="card">
                                            <div className="card-header fw-bold">
                                                Casing Details
                                            </div>

                                            <div className="card-body m-0 p-1">

                                                <div className="row mb-1">
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

                                                <div className="row mb-1">
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
                                        <div className="card">
                                            <div className="card-header fw-bold">
                                                Customer Requested Pattern
                                            </div>

                                            <div className="card-body m-0 p-1">

                                                <div className="row mb-1">
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

                                                <div className="row mb-1">
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

                                                <div className="row ">
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
                                        <div className="card">
                                            <div className="card-header fw-bold">
                                                Suggested Pattern - Technician
                                            </div>

                                            <div className="card-body m-0 p-1">

                                                <div className="row mb-1">
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

                                                <div className="row mb-1">
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
                                <div className="card mt-1">
                                    <div className="card-header fw-bold">
                                        Approved Pattern Change
                                    </div>

                                    <div className="card-body">

                                        <div className="form-check">
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
                                <div className="row g-3 mb-1">

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

                                {/* =================================================
                  ACTION BUTTONS
            ================================================== */}
                                <div className="row g-3">

                                    {/* APPROVE */}
                                    <div className="col-md-6">

                                        <button
                                            type="button"
                                            className="btn btn-approve w-100 h-100"
                                            style={{
                                                // background: "linear-gradient(135deg, #28a745, #26a369)",
                                                height: "100%",
                                            }}
                                            onClick={handleApprove}
                                        >
                                            <b>APPROVED</b>
                                        </button>

                                    </div>

                                    {/* REJECT */}
                                    <div className="col-md-6">

                                        <button
                                            type="button"
                                            className="btn btn-reject w-100 h-100"
                                            style={{
                                                height: "100%",
                                            }}
                                            onClick={handleReject}
                                        >
                                            <b>REJECTED</b>
                                        </button>

                                    </div>

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