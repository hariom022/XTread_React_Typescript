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
  const confirmationAction: NailInspectionHoldAction = order.requiresLpo
    ? "LPO_RECEIVED"
    : "PAYMENT_RECEIVED";

  const confirmationLabel = order.requiresLpo
    ? "LPO Received"
    : "Payment Received";

  const hasCommercialRequirement =
    order.requiresLpo || order.requiresPayment;

  return (
    <>
      <div
        className="modal fade show"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nailInspectionHoldTitle"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="nailInspectionHoldTitle">
                Nail Inspection Hold Details
              </h5>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onBack}
                disabled={actionLoading}
              />
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="card border-0 bg-light mb-4">
                <div className="card-header bg-light">
                  <h6 className="mb-0">Order Information</h6>
                </div>

                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <strong>Order Number</strong>
                      <div>{order.orderNumber || "-"}</div>
                    </div>

                    <div className="col-md-4">
                      <strong>Customer</strong>
                      <div>{order.customerName || "-"}</div>
                    </div>

                    <div className="col-md-4">
                      <strong>Hold Type</strong>
                      <div>{order.holdType ?? "-"}</div>
                    </div>

                    <div className="col-md-4">
                      <strong>Total Casings</strong>
                      <div>{order.casings?.length ?? 0}</div>
                    </div>

                    <div className="col-md-4">
                      <strong>LPO Required</strong>
                      <div>{order.requiresLpo ? "Yes" : "No"}</div>
                    </div>

                    <div className="col-md-4">
                      <strong>Payment Required</strong>
                      <div>{order.requiresPayment ? "Yes" : "No"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <h6 className="mb-3">Order Casings</h6>

              {loading ? (
                <div className="text-center py-4">
                  Loading casings...
                </div>
              ) : (
                <div className="table-responsive mb-4">
                  <table className="table table-hover table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Line No.</th>
                        <th>Production No.</th>
                        <th>Tyre Reference</th>
                        <th>Tyre Size</th>
                        <th>Tyre Make</th>
                        <th>Service Type</th>
                        <th>Hold Type</th>
                        <th>Casing Stage</th>
                        <th>Stage Status</th>
                        <th>Created At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {!order.casings || order.casings.length === 0 ? (
                        <tr>
                          <td
                            colSpan={10}
                            className="text-center text-muted py-4"
                          >
                            No casings found for this order.
                          </td>
                        </tr>
                      ) : (
                        order.casings.map((casing) => (
                          <tr key={casing.orderCasingId}>
                            <td>{casing.lineNumber ?? "-"}</td>
                            <td>{casing.productionNumber || "-"}</td>
                            <td>{casing.tyreReferenceNumber || "-"}</td>
                            <td>{casing.tyreSizeLabel || "-"}</td>
                            <td>{casing.tyreMakeName || "-"}</td>
                            <td>{casing.serviceTypeName || "-"}</td>
                            <td>{casing.holdType ?? "-"}</td>
                            <td>{casing.casingStage ?? "-"}</td>
                            <td>{casing.casingStageStatus ?? "-"}</td>
                            <td>
                              {casing.createdAtUtc
                                ? new Date(
                                    casing.createdAtUtc
                                  ).toLocaleString()
                                : "-"}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <h6>Order Actions</h6>
              <p className="text-muted">
                Confirm the applicable LPO or payment requirement at order
                level, or reject the order.
              </p>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onBack}
                disabled={actionLoading}
              >
                Close
              </button>

              {hasCommercialRequirement && (
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={() => void onAction(confirmationAction)}
                >
                  {actionLoading ? "Processing..." : confirmationLabel}
                </button>
              )}

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
      </div>
    </>
  );
};

export default NailInspectionHoldDetails;