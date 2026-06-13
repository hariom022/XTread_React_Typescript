import "../style/buildingStage.css"
type Props = {
    selectedItem: any;

    selectedPattern: string;

    selectedWidth: string;

    setSelectedWidth:
    React.Dispatch<
        React.SetStateAction<string>
    >;

    widthOptions: number[];

    handleApprove: () => void;

    handleReturnToRepair: () => void;

    onClose: () => void;
};

const BuildingModal = ({
    selectedItem,

    selectedPattern,

    selectedWidth,
    setSelectedWidth,

    widthOptions,

    handleApprove,
    handleReturnToRepair,

    onClose,
}: Props) => {
    return (
        <>
            <div
                className="modal fade show d-block"
                style={{
                    background:
                        "rgba(0,0,0,0.5)",
                }}
            >
                <div className="modal-dialog modal-xl modal-dialog-centered">

                    <div className="modal-content">

                        {/* HEADER */}

                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title flex-grow-1 text-white text-start">
                                BUILDING - APPROVAL
                            </h5>
                            <div className="me-3 text-white text-end">
                                <div>John</div>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                onClick={onClose}
                            />
                        </div>


                        {/* BODY */}

                        <div className="modal-body">

                            <div className="mb-2">

                                <div className="modal-info m-0 p-1 mb-1 postbuff-top row text-nowrap">

                                    <div className="col">
                                        <strong>Production No</strong>
                                        <div>{selectedItem?.casing}</div>
                                    </div>

                                    <div className="col">
                                        <strong>Tyre Ref No</strong>
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
                                        <div>
                                            {selectedItem?.requestedPattern}
                                        </div>
                                    </div>

                                    <div className="col">
                                        <strong>ReApproved Pattern</strong>
                                        <div>
                                            {selectedItem?.reApprovedPattern}
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div className="row g-1">
                                <div className="row align-items-stretch ">

                                    {/* LEFT PANEL */}

                                    <div className="col-md-6 p-1">

                                        <div className="panel-box">

                                            <div className="panel-body left-panel-body">

                                                <div className="record-box p-3 text-start">

                                                    <div className="record-header fw-bold mb-2">
                                                        Record [1 of 1]
                                                    </div>

                                                    <div className="row gx-5 gy-1">

                                                        <div className="record-item">
                                                            <b>Tyre Size:</b>{" "}
                                                            {selectedItem?.tyreSize}
                                                        </div>

                                                        <div className="record-item">
                                                            <b>Make:</b>{" "}
                                                            {selectedItem?.tyreMake}
                                                        </div>

                                                        <div className="record-item">
                                                            <b>Model:</b>{" "}
                                                            {selectedItem?.model}
                                                        </div>

                                                        <div className="record-item">
                                                            <b>Brand:</b>{" "}
                                                            {selectedItem?.brand}
                                                        </div>

                                                        <div className="record-item">
                                                            <b>Pattern:</b>{" "}
                                                            {selectedItem?.requestedPattern}
                                                        </div>

                                                        <div className="record-item">
                                                            <b>Width:</b>{" "}
                                                            {selectedItem?.width}
                                                        </div>

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* RIGHT PANEL */}

                                    <div className="col-md-6 p-1">

                                        <div className="panel-box">

                                            <div className="panel-body ">

                                                {/* PATTERN + WIDTH */}

                                                <div className="w-100 mb-3">

                                                    <div className="row g-2">

                                                        <div className="col-6">

                                                            <label className="form-label fw-semibold">
                                                                Pattern
                                                            </label>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={selectedPattern}
                                                                readOnly
                                                            />

                                                        </div>

                                                        <div className="col-6">

                                                            <label className="form-label fw-semibold">
                                                                Width
                                                            </label>

                                                            <select
                                                                className="form-select"
                                                                value={selectedWidth}
                                                                onChange={(e) =>
                                                                    setSelectedWidth(
                                                                        e.target.value,
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Select Width
                                                                </option>

                                                                {widthOptions.map(
                                                                    (width) => (
                                                                        <option
                                                                            key={width}
                                                                            value={width}
                                                                        >
                                                                            {width}
                                                                        </option>
                                                                    ),
                                                                )}

                                                            </select>

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* RETURN TO REPAIR */}
                                                <div>
                                                    <button
                                                        className="btn-return btn-action w-100 d-flex align-items-center justify-content-center"
                                                        onClick={handleReturnToRepair}
                                                    >
                                                        Return To Repairs
                                                        <span className="icon-box">
                                                            <i className="bi bi-dash-circle"></i>
                                                        </span>

                                                    </button>
                                                </div>

                                                {/* APPROVED */}
                                                <div className="mt-2">
                                                    <button
                                                        className="btn-approve btn-action  w-100 d-flex align-items-center justify-content-center"
                                                        onClick={handleApprove}
                                                    >
                                                        APPROVED
                                                        <span className="icon-box">
                                                            <i className="bi bi-check-lg"></i>
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
            </div >

            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default BuildingModal;