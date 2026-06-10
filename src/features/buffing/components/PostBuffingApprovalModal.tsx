import { useEffect } from "react";
import buffingStageServiceApi from "../service/buffingStageServiceApi";

interface Machine {
    machineId: number;
    machineName: string;
}

interface DamageLevel {
    damageLevelId: number;
    name: string;
}

interface PatternVariant {
    treadPatternVariantId: number;
    width: string;
}

interface RejectionReason {
    rejectionReasonId: number;
    code: string;
    reason: string;
}

interface SelectedItem {
    id: number;
    casing: string;
    serial: string;
    customerName: string;
    tyreSize: string;
    tyreMake: string;
    model: string;
    brand: string;
    width: string;
    requestedPattern: string;
    reApprovedPattern?: string;
}

interface Props {
    postBuffingModalRef: React.RefObject<HTMLDivElement | null>;

    selectedItem: SelectedItem | null;

    machines: Machine[];
    damageLevels: DamageLevel[];
    patternVariants: PatternVariant[];
    postBuffingReasons: RejectionReason[];

    machineId: number | "";
    setMachineId: React.Dispatch<
        React.SetStateAction<number | "">
    >;

    damageLevelId: number | "";
    setDamageLevelId: React.Dispatch<
        React.SetStateAction<number | "">
    >;

    selectedPostVariantId: number | "";
    setSelectedPostVariantId: React.Dispatch<
        React.SetStateAction<number | "">
    >;

    circumference: string;
    setCircumference: React.Dispatch<
        React.SetStateAction<string>
    >;

    override: boolean;
    setOverride: React.Dispatch<
        React.SetStateAction<boolean>
    >;

    postRejectReason: string;
    setPostRejectReason: React.Dispatch<
        React.SetStateAction<string>
    >;

    // setShowPostChecklist: React.Dispatch<
    //     React.SetStateAction<boolean>
    // >;

    handleApprove: () => void;
    handleReject: () => void;

    resetModal: () => void;
}

const PostBuffingApprovalModal= ({
    postBuffingModalRef,

    selectedItem,

    machines,
    damageLevels,
    patternVariants,
    postBuffingReasons,

    machineId,
    setMachineId,

    damageLevelId,
    setDamageLevelId,

    selectedPostVariantId,
    setSelectedPostVariantId,

    circumference,
    setCircumference,

    override,
    setOverride,

    postRejectReason,
    setPostRejectReason,

    // setShowPostChecklist,

    handleApprove,
    handleReject,

    resetModal,
}: Props) => {
    return (
        <div
            className="modal fade"
            ref={postBuffingModalRef}
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content postbuff-modal">

                    {/* HEADER */}

                    <div className="modal-header">
                        <h5 className="modal-title w-100">
                            POST BUFFING - APPROVAL
                        </h5>

                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            onClick={resetModal}
                        />
                    </div>

                    {/* BODY */}

                    <div
                        className="modal-body"
                        style={{ overflowX: "hidden" }}
                    >
                        {/* TOP INFO */}

                        <div className="modal-info m-0 p-1 mb-1 postbuff-top row text-nowrap">

                            <div className="col">
                                <strong>Production No</strong>
                                <div>{selectedItem?.casing}</div>
                            </div>

                            <div className="col">
                                <strong>Serial No</strong>
                                <div>{selectedItem?.serial}</div>
                            </div>

                            <div className="col">
                                <strong>Customer Name</strong>
                                <div>{selectedItem?.customerName}</div>
                            </div>

                            <div className="col">
                                <strong>Tyre Size</strong>
                                <div>{selectedItem?.tyreSize}</div>
                            </div>

                            <div className="col">
                                <strong>Requested Pattern</strong>
                                <div>{selectedItem?.requestedPattern}</div>
                            </div>

                            <div className="col">
                                <strong>ReApproved Pattern</strong>
                                <div>{selectedItem?.reApprovedPattern}</div>
                            </div>

                        </div>

                        {/* MATERIAL */}

                        <div className="box material-box mb-2">

                            <div className="box-title">
                                MATERIAL AVAILABILITY
                            </div>

                            <div className="panel-body p-1">

                                <div className="d-flex align-items-center justify-content-between gap-2">

                                    <div className="d-flex align-items-center gap-2">
                                        <div>Available KGs</div>

                                        <span className="value-box text-danger small">
                                            0.00
                                        </span>
                                    </div>

                                    <div className="d-flex align-items-center gap-2">
                                        <div>Approx. Casings</div>

                                        <span className="value-box text-danger small">
                                            0
                                        </span>
                                    </div>

                                    <div className="col-md-3">

                                        <select
                                            className="form-select form-select-sm"
                                            value={machineId}
                                            onChange={(e) =>
                                                setMachineId(
                                                    Number(e.target.value)
                                                )
                                            }
                                        >
                                            <option value="">
                                                Machine Selection
                                            </option>

                                            {machines.map((item) => (
                                                <option
                                                    key={item.machineId}
                                                    value={item.machineId}
                                                >
                                                    {item.machineName}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RECORD */}

                        <div className="record-box mb-2">

                            <div className="record-header">
                                Record [1 of 1]
                            </div>

                            <div className="d-flex justify-content-between small">

                                <div>
                                    <b>Tyre Size:</b>{" "}
                                    {selectedItem?.tyreSize}
                                </div>

                                <div>
                                    <b>Make:</b>{" "}
                                    {selectedItem?.tyreMake}
                                </div>

                                <div>
                                    <b>Model:</b>{" "}
                                    {selectedItem?.model}
                                </div>

                                <div>
                                    <b>Brand:</b>{" "}
                                    {selectedItem?.brand}
                                </div>

                                <div>
                                    <b>Pattern:</b>{" "}
                                    {selectedItem?.requestedPattern}
                                </div>

                                <div>
                                    <b>Width:</b>{" "}
                                    {selectedItem?.width}
                                </div>

                            </div>

                        </div>

                        {/* FORM */}

                        <div className="row">

                            <div className="col-md-8">

                                <div className="box p-2">

                                    <div className="mb-2">

                                        <label className="form-label">
                                            Override
                                        </label>

                                        <br />

                                        <input
                                            type="checkbox"
                                            checked={override}
                                            onChange={(e) =>
                                                setOverride(
                                                    e.target.checked
                                                )
                                            }
                                        />

                                    </div>

                                    <div className="row">

                                        <div className="col-md-3">
                                            <label>Pattern</label>

                                            <input
                                                className="form-control"
                                                value={
                                                    selectedItem?.requestedPattern ||
                                                    ""
                                                }
                                                readOnly
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <label>Crown Width</label>

                                            <select
                                                className="form-select"
                                                value={
                                                    selectedPostVariantId
                                                }
                                                onChange={(e) =>
                                                    setSelectedPostVariantId(
                                                        Number(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Width
                                                </option>

                                                {patternVariants.map(
                                                    (variant) => (
                                                        <option
                                                            key={
                                                                variant.treadPatternVariantId
                                                            }
                                                            value={
                                                                variant.treadPatternVariantId
                                                            }
                                                        >
                                                            {variant.width}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                        <div className="col-md-2">
                                            <label>Circumference</label>

                                            <input
                                                type="number"
                                                className="form-control"
                                                value={circumference}
                                                onChange={(e) =>
                                                    setCircumference(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <label>
                                                Damage Level
                                            </label>

                                            <select
                                                className="form-select"
                                                value={damageLevelId}
                                                onChange={(e) =>
                                                    setDamageLevelId(
                                                        Number(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Damage Level
                                                </option>

                                                {damageLevels.map(
                                                    (item) => (
                                                        <option
                                                            key={
                                                                item.damageLevelId
                                                            }
                                                            value={
                                                                item.damageLevelId
                                                            }
                                                        >
                                                            {item.name}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>

                                    </div>

                                    <div className="row mt-2">

                                        <div className="col-md-8">

                                            <label>Remarks</label>

                                            <textarea
                                                rows={3}
                                                className="form-control"
                                            />

                                        </div>

                                        <div className="col-md-4">

                                            <button
                                                className="btn btn-primary w-100 mt-4"
                                                // onClick={() =>
                                                //     setShowPostChecklist(
                                                //         true
                                                //     )
                                                // }
                                            >
                                                Post-Buffing Checklist
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* RIGHT PANEL */}

                            <div className="col-md-4">

                                <label>
                                    Rejection Reason
                                </label>

                                <select
                                    className="form-select mt-1 mb-3"
                                    value={postRejectReason}
                                    onChange={(e) =>
                                        setPostRejectReason(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select Reason
                                    </option>

                                    {postBuffingReasons.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.rejectionReasonId
                                                }
                                                value={item.code}
                                            >
                                                {item.reason}
                                            </option>
                                        )
                                    )}
                                </select>

                                <button
                                    className="btn btn-reject w-100 mb-3"
                                    onClick={handleReject}
                                >
                                    REJECTED
                                </button>

                                <button
                                    className="btn btn-approve w-100"
                                    onClick={handleApprove}
                                >
                                    APPROVED
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default PostBuffingApprovalModal;