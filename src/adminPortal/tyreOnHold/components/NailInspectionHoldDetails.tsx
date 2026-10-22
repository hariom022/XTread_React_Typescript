import type {
    NailInspectionHoldOrderDetails,
    NailInspectionHoldAction,
} from "../types/nailInspectionHold.types";

interface Props {
    order: NailInspectionHoldOrderDetails;
    loading: boolean;
    actionLoading: boolean;
    error: string | null;
    onBack: () => void;
    onAction: (action: NailInspectionHoldAction) => void | Promise<void>;
}

const NailInspectionHoldDetails = ({
    order,
    loading,
    actionLoading,
    error,
    onBack,
    onAction,
}: Props) => {
    const approvedCasings = order.casings.filter(
        (casing) => casing.inspectionStatus === "APPROVED"
    );

    const rejectedCasings = order.casings.filter(
        (casing) => casing.inspectionStatus === "REJECTED"
    );

    const pendingCasings = order.casings.filter(
        (casing) => casing.inspectionStatus === "PENDING"
    );

    const canConfirm =
        order.holdStatus === "READY" &&
        pendingCasings.length === 0 &&
        approvedCasings.length > 0;

    const confirmationAction: NailInspectionHoldAction =
        order.commercialRequirement === "LPO"
            ? "LPO_RECEIVED"
            : "PAYMENT_RECEIVED";

    const confirmationLabel =
        order.commercialRequirement === "LPO"
            ? "LPO Received"
            : "Payment Received";

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Nail Inspection Hold Details</h4>

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onBack}
                    disabled={actionLoading}
                >
                    Back to Orders
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Order Information</h5>
                </div>

                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <strong>Order Number</strong>
                            <div>{order.orderNumber}</div>
                        </div>

                        <div className="col-md-3">
                            <strong>Order Date</strong>
                            <div>
                                {order.orderDate
                                    ? new Date(order.orderDate).toLocaleDateString("en-GB")
                                    : "-"}
                            </div>
                        </div>

                        <div className="col-md-3">
                            <strong>Customer</strong>
                            <div>{order.customerName || "-"}</div>
                        </div>

                        <div className="col-md-3">
                            <strong>Service Type</strong>
                            <div>{order.serviceTypeName || "-"}</div>
                        </div>

                        <div className="col-md-3">
                            <strong>Commercial Requirement</strong>
                            <div>{order.commercialRequirement}</div>
                        </div>

                        <div className="col-md-3">
                            <strong>Hold Status</strong>
                            <div>{order.holdStatus}</div>
                        </div>

                        <div className="col-md-3">
                            <strong>Total Casings</strong>
                            <div>{order.totalCasings}</div>
                        </div>

                        <div className="col-md-3">
                            <strong>Approved / Rejected / Pending</strong>
                            <div>
                                {approvedCasings.length} / {rejectedCasings.length} /{" "}
                                {pendingCasings.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Order Casings</h5>
                </div>

                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">Loading casings...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Production No.</th>
                                        <th>Tyre Reference</th>
                                        <th>Tyre Size</th>
                                        <th>Tyre Make</th>
                                        <th>Pattern</th>
                                        <th>Inspection Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {order.casings.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="text-center text-muted py-4"
                                            >
                                                No casings found for this order.
                                            </td>
                                        </tr>
                                    ) : (
                                        order.casings.map((casing) => (
                                            <tr key={casing.orderCasingId}>
                                                <td>{casing.productionNumber || "-"}</td>
                                                <td>{casing.tyreReferenceNumber || "-"}</td>
                                                <td>{casing.tyreSizeLabel || "-"}</td>
                                                <td>{casing.tyreMakeName || "-"}</td>
                                                <td>{casing.patternName || "-"}</td>
                                                <td>
                                                    <span
                                                        className={`badge ${casing.inspectionStatus === "APPROVED"
                                                                ? "bg-success"
                                                                : casing.inspectionStatus === "REJECTED"
                                                                    ? "bg-danger"
                                                                    : "bg-secondary"
                                                            }`}
                                                    >
                                                        {casing.inspectionStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {order.holdStatus !== "REJECTED" &&
                order.holdStatus !== "CONFIRMED" && (
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <h5>Order Actions</h5>

                            <p className="text-muted">
                                Confirm the applicable commercial requirement after the
                                inspection requirements are satisfied, or reject the order.
                            </p>

                            {!canConfirm && (
                                <div className="alert alert-warning">
                                    {order.holdStatus !== "READY"
                                        ? "The order is not ready for confirmation."
                                        : pendingCasings.length > 0
                                            ? "All casings must finish inspection before confirmation."
                                            : "At least one casing must be approved before confirmation."}
                                </div>
                            )}

                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    disabled={!canConfirm || actionLoading}
                                    onClick={() => void onAction(confirmationAction)}
                                >
                                    {actionLoading ? "Processing..." : confirmationLabel}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    disabled={actionLoading}
                                    onClick={() => void onAction("REJECT_ORDER")}
                                >
                                    Reject Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default NailInspectionHoldDetails;