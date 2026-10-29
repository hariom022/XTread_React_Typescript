import type {
  NailInspectionHoldOrderDetails,
  NailInspectionHoldAction,
} from "../types/nailInspectionHold.types";
import { useEffect, useState } from "react";
import holdTyreServiceApi from "../service/holdTyreServiceApi";

interface Props {
  order: NailInspectionHoldOrderDetails;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  onBack: () => void;
  onAction: (
    action: NailInspectionHoldAction,
    value?: number | string,
  ) => void | Promise<void>;
}


const getHoldTypeName = (
  holdType: number | null | undefined,
): string => {
  switch (holdType) {
    case 1:
      return "Customer LPO";
    case 2:
      return "Payment";
    default:
      return "-";
  }
};

const getCasingStageName = (
  casingStage: number | null | undefined,
): string => {
  switch (casingStage) {
    case 1:
      return "Collection";
    case 2:
      return "Receiving";
    case 3:
      return "Visual Inspection";
    case 4:
      return "Nail Inspection";
    case 5:
      return "Pressure Test";
    case 6:
      return "Shearography";
    case 7:
      return "Buffing";
    case 8:
      return "Skiving";
    case 9:
      return "Cementing";
    case 10:
      return "Repairs";
    case 11:
      return "Fill Up";
    case 12:
      return "Building";
    case 13:
      return "Enveloping";
    case 14:
      return "Curing";
    case 15:
      return "Quality Control";
    case 16:
      return "Dispatched";
    case 17:
      return "Mounting";
    case 18:
      return "Tread Bench";
    default:
      return casingStage == null
        ? "-"
        : `Unknown (${casingStage})`;
  }
};

const getCasingStageStatusName = (
  status: number | null | undefined,
): string => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Approved";
    case 3:
      return "Hold";
    case 4:
      return "Rejected";
    case 5:
      return "In Progress";
    case 6:
      return "Cancelled";
    case 7:
      return "Unloaded";
    case 8:
      return "Loaded";
    case 9:
      return "Bypassed";
    default:
      return status == null
        ? "-"
        : `Unknown (${status})`;
  }
};

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


  const [rejectionReasons, setRejectionReasons] = useState<
    { rejectionReasonId: number; reason: string }[]
  >([]);

  const [referenceNumber, setReferenceNumber] = useState("");

  const [selectedRejectionReasonId, setSelectedRejectionReasonId] =
    useState("");

  const [rejectionReasonsLoading, setRejectionReasonsLoading] =
    useState(false);

  useEffect(() => {
    const loadRejectionReasons = async () => {
      try {
        setRejectionReasonsLoading(true);

        const response =
          await holdTyreServiceApi.getNailInspectionHoldRejectionReasons();

        if (
          response.data?.success === true &&
          Array.isArray(response.data.data)
        ) {
          setRejectionReasons(response.data.data);
        } else {
          setRejectionReasons([]);
        }
      } catch (error) {
        console.error("Failed to load rejection reasons:", error);
        setRejectionReasons([]);
      } finally {
        setRejectionReasonsLoading(false);
      }
    };

    void loadRejectionReasons();
  }, []);

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
                      <div>{getHoldTypeName(order.holdType)}</div>
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
                            <td>{getHoldTypeName(casing.holdType)}</td>
                            <td>{getCasingStageName(casing.casingStage)}</td>
                            <td>{getCasingStageStatusName(casing.casingStageStatus)}</td>
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

              <div className="row g-1 mb-4">
                {/* REFERENCE NUMBER */}
                <div className="col-md-6">
                  <label
                    htmlFor="commercialReferenceNumber"
                    className="form-label fw-semibold"
                  >
                    Reference Number <span className="text-danger">*</span>
                  </label>

                  <input
                    id="commercialReferenceNumber"
                    type="text"
                    className="form-control"
                    placeholder="Enter reference number"
                    value={referenceNumber}
                    onChange={(event) => setReferenceNumber(event.target.value)}
                    disabled={actionLoading}
                  />
                </div>

                {/* REJECTION REASON */}
                <div className="col-md-6">
                  <label
                    htmlFor="nailInspectionRejectionReason"
                    className="form-label fw-semibold"
                  >
                    Rejection Reason <span className="text-danger">*</span>
                  </label>

                  <select
                    id="nailInspectionRejectionReason"
                    className="form-select"
                    value={selectedRejectionReasonId}
                    onChange={(event) =>
                      setSelectedRejectionReasonId(event.target.value)
                    }
                    disabled={rejectionReasonsLoading || actionLoading}
                  >
                    <option value="">
                      {rejectionReasonsLoading
                        ? "Loading rejection reasons..."
                        : "Select rejection reason"}
                    </option>

                    {rejectionReasons.map((item) => (
                      <option
                        key={item.rejectionReasonId}
                        value={item.rejectionReasonId}
                      >
                        {item.reason}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            <div className="modal-footer">
              {hasCommercialRequirement && (
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={actionLoading}
                  onClick={() => {
                    const trimmedReferenceNumber = referenceNumber.trim();

                    if (!trimmedReferenceNumber) {
                      alert("Please enter the reference number.");
                      return;
                    }

                    void onAction(confirmationAction, trimmedReferenceNumber);
                  }}
                >
                  {actionLoading ? "Processing..." : confirmationLabel}
                </button>
              )}

              <button
                type="button"
                className="btn btn-danger"
                disabled={actionLoading}
                onClick={() => {
                  if (!selectedRejectionReasonId) {
                    alert("Please select a rejection reason.");
                    return;
                  }

                  void onAction(
                    "REJECT_ORDER",
                    Number(selectedRejectionReasonId),
                  );
                }}
              >
                {actionLoading ? "Processing..." : "Reject Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NailInspectionHoldDetails;