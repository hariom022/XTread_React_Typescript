import { useState, useEffect } from "react";
import holdTyreServiceApi from "../service/holdTyreServiceApi";

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
    const [changeRequestedPattern, setChangeRequestedPattern] = useState(true);

    const [selectedPattern, setSelectedPattern] = useState("");

    const [selectedWidth, setSelectedWidth] = useState("");

    const [selectedBrand, setSelectedBrand] = useState("");

    const [comments, setComments] = useState("");
    const [casingDetails, setCasingDetails] = useState<any>(null);

    const [loadingCasingDetails, setLoadingCasingDetails] = useState(false);

    const [patternSuggestions, setPatternSuggestions] = useState<any[]>([]);
    const [loadingPatternSuggestions, setLoadingPatternSuggestions] = useState(false);

    const [patternVariants, setPatternVariants] = useState<any[]>([]);
    const [loadingPatternVariants, setLoadingPatternVariants] = useState(false);


    //get order casing details for the selected item
    useEffect(() => {
        const loadCasingDetails = async () => {
            if (!selectedItem?.orderCasingId) {
                return;
            }

            try {
                setLoadingCasingDetails(true);

                const response =
                    await holdTyreServiceApi.getOrderCasingById(
                        selectedItem.orderCasingId
                    );

                console.log(
                    "PRE-BUFFING CASING DETAILS:",
                    response
                );

                if (response?.data?.success) {
                    setCasingDetails(
                        response.data.data
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load casing details:",
                    error
                );

                setCasingDetails(null);
            } finally {
                setLoadingCasingDetails(false);
            }
        };

        loadCasingDetails();
    }, [selectedItem?.orderCasingId]);

    // =========================================================
    // GET AVAILABLE TREAD PATTERNS
    // =========================================================
    useEffect(() => {
        const loadTreadPatterns = async () => {
            if (!casingDetails) {
                return;
            }

            const categoryId =
                casingDetails.category?.categoryId;

            const tyreClassificationId =
                casingDetails.tyreClassification?.id;

            const isRetread =
                casingDetails.isRetreaded ?? false;

            const override =
                casingDetails.retreadDetail?.isPatternOverride ?? false;

            if (!categoryId || !tyreClassificationId) {
                return;
            }

            try {
                setLoadingPatternSuggestions(true);

                const response =
                    await holdTyreServiceApi.getTreadPatterns(
                        categoryId,
                        tyreClassificationId,
                        isRetread,
                        override
                    );

                console.log(
                    "AVAILABLE TREAD PATTERNS:",
                    response
                );

                if (response?.data?.success) {
                    setPatternSuggestions(
                        response.data.data || []
                    );
                } else {
                    setPatternSuggestions([]);
                }
            } catch (error) {
                console.error(
                    "Failed to load tread patterns:",
                    error
                );

                setPatternSuggestions([]);
            } finally {
                setLoadingPatternSuggestions(false);
            }
        };

        loadTreadPatterns();
    }, [casingDetails]);

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
                                        <div>
                                            {casingDetails?.productionNumber || selectedItem?.casing || "-"}
                                        </div>
                                    </div>

                                    <div className="col">
                                        <strong>Tyre Ref No</strong>
                                        <div>
                                            {casingDetails?.tyreReferenceNumber || selectedItem?.serial || "-"}
                                        </div>
                                    </div>

                                    <div className="col">
                                        <strong>Customer Name</strong>
                                        <div>
                                            {casingDetails?.customerName || selectedItem?.customerName || "-"}
                                        </div>
                                    </div>

                                    <div className="col">
                                        <strong>Tyre Size</strong>
                                        <div>
                                            {casingDetails?.tyreSize?.casingSize || selectedItem?.tyreSize || "-"}
                                        </div>
                                    </div>

                                    <div className="col">
                                        <strong>Requested Pattern</strong>
                                        <div>{casingDetails?.retreadDetail?.patternName || "-"}</div>
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
                                                            value={casingDetails?.tyreMake?.name || ""}
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
                                                            value={casingDetails?.model || ""}
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
                                                            value={casingDetails?.tyreSize?.casingSize || ""}
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
                                                            value={casingDetails?.retreadDetail?.brand || ""
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
                                                            value={casingDetails?.retreadDetail?.patternName || ""}
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
                                                            value={casingDetails?.retreadDetail?.width ?? ""}
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
                                                    onChange={async (e) => {
                                                        const patternId = e.target.value;

                                                        setSelectedPattern(patternId);

                                                        // Reset previous values
                                                        setSelectedWidth("");
                                                        setSelectedBrand("");
                                                        setPatternVariants([]);

                                                        if (!patternId) {
                                                            return;
                                                        }

                                                        try {
                                                            setLoadingPatternVariants(true);

                                                            const response =
                                                                await holdTyreServiceApi.getTreadPatternVariants(
                                                                    Number(patternId)
                                                                );

                                                            console.log(
                                                                "SELECTED TREAD PATTERN VARIANTS:",
                                                                response
                                                            );

                                                            if (response?.data?.success) {
                                                                const patternData =
                                                                    response.data.data?.[0];

                                                                const variants =
                                                                    patternData?.variants || [];

                                                                setPatternVariants(variants);

                                                                // Auto-fill Brand
                                                                setSelectedBrand(
                                                                    patternData?.brand || ""
                                                                );
                                                            } else {
                                                                setPatternVariants([]);
                                                                setSelectedBrand("");
                                                            }
                                                        } catch (error) {
                                                            console.error(
                                                                "Failed to load tread pattern variants:",
                                                                error
                                                            );

                                                            setPatternVariants([]);
                                                            setSelectedBrand("");
                                                        } finally {
                                                            setLoadingPatternVariants(false);
                                                        }
                                                    }}
                                                >
                                                    <option value="">
                                                        {loadingPatternSuggestions
                                                            ? "Loading Patterns..."
                                                            : "Select Pattern"}
                                                    </option>

                                                    {patternSuggestions.map((pattern) => (
                                                        <option
                                                            key={pattern.treadPatternId}
                                                            value={pattern.treadPatternId}
                                                        >
                                                            {pattern.brand} - {pattern.patternName}
                                                        </option>
                                                    ))}
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
                                                        setSelectedWidth(e.target.value)
                                                    }
                                                    disabled={
                                                        !selectedPattern ||
                                                        loadingPatternVariants
                                                    }
                                                >
                                                    <option value="">
                                                        {loadingPatternVariants
                                                            ? "Loading Widths..."
                                                            : "Select Width"}
                                                    </option>

                                                    {patternVariants.map((variant: any) => (
                                                        <option
                                                            key={variant.treadPatternVariantId}
                                                            value={variant.width}
                                                        >
                                                            {variant.width}
                                                        </option>
                                                    ))}
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
                                                    readOnly
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