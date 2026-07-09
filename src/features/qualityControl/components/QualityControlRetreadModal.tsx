import React, { useState } from "react";
import qualityControlServiceApi from "../service/qualityControlServiceApi";
import { buildQualityControlRequest } from "../utils/qualityControlHelper";
import { type RejectionReason } from "../type/qualityControl.type";
import { RingLoader } from "react-spinners";

interface Props {
  selectedItem: any;

  rejectReason: string;
  setRejectReason: (value: string) => void;
  rejectionReasons: RejectionReason[];
  rejectComment: string;
  setRejectComment: (value: string) => void;

  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

const QualityControlRetreadModal = ({
  selectedItem,
  rejectReason,
  setRejectReason,
  rejectionReasons,
  rejectComment,
  setRejectComment,
  onApprove,
}: Props) => {
  // const [reprocessRoute, setReprocessRoute] = useState<
  //   "repair" | "recoverRubber" | null
  // >(null);

  const [recoverDecision, setRecoverDecision] = useState<
    "approved" | "rejected" | null
  >(null);
  const [destinationStage, setDestinationStage] = useState<number | null>(null);
  const [decision, setDecision] = useState<
    "approve" | "recoverRubber" | "destination" | null
  >(null);
  const [processing, setProcessing] = useState(false);
  if (!selectedItem) return null;

  const handleSubmit = async () => {
    try {
      setProcessing(true);
      let payload = null;
      let successMessage = "";

      // Approve -> Dispatch
      if (decision === "approve") {
        payload = buildQualityControlRequest(
          selectedItem.orderCasingId,
          "APPROVE",
        );

        successMessage = "Tyre approved and moved to Dispatch.";
      }

      // Recover Rubber -> Dispatch
      else if (decision === "recoverRubber" && recoverDecision === "approved") {
        payload = buildQualityControlRequest(
          selectedItem.orderCasingId,
          "RECOVER_RUBBER_APPROVED",
        );

        successMessage = "Rubber recovery approved. Tyre moved to Dispatch.";
      }

      // Recover Rubber -> PreBuffing
      else if (decision === "recoverRubber" && recoverDecision === "rejected") {
        payload = buildQualityControlRequest(
          selectedItem.orderCasingId,
          "RECOVER_RUBBER_REJECTED",
        );

        successMessage =
          "Rubber recovery rejected. Tyre returned to Pre-Buffing.";
      }

      // Destination Stage
      else if (decision === "destination" && destinationStage !== null) {
        if (!rejectReason) {
          alert("Please select a rejection reason.");
          return;
        }

        payload = {
          orderCasingIds: [selectedItem.orderCasingId],
          isApproved: false,
          destinationStage,
          isRecoverRubber: null,
          isRubberRecoveryApproved: null,
          rejectionReasonCode: rejectReason,
        };

        successMessage = "Tyre moved successfully.";
      }

      if (!payload) {
        alert("Please complete the QC decision.");
        return;
      }

      await qualityControlServiceApi.approveReject(payload);

      alert(successMessage);

      onApprove();
    } catch (error) {
      console.error(error);
      alert("Failed to process Quality Control decision.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Header Info */}
      <div className="modal-info m-0 p-2 building-top row text-nowrap">
        <div className="col-2">
          <strong>Production No</strong>
          <div>{selectedItem.productionNumber}</div>
        </div>

        <div className="col-2">
          <strong>Type Ref No</strong>
          <div>{selectedItem.serial}</div>
        </div>

        <div className="col-2">
          <strong>Customer Name</strong>
          <div>{selectedItem.customerName}</div>
        </div>

        <div className="col-2">
          <strong>Tyre Size</strong>
          <div>{selectedItem.tyreSize}</div>
        </div>

        <div className="col-2">
          <strong>Requested Pattern</strong>
          <div>{selectedItem.requestedPattern}</div>
        </div>
      </div>

      <div className="row">
        {/* LEFT SIDE */}
        <div className="col-md-6 p-3">
          <div className="panel-box">
            <div className="panel-body p-3">
              {/* Repair Details */}
              {selectedItem.repairOperations?.length > 0 && (
                <>
                  <h5 className="mb-3">Repair Details</h5>

                  <table className="table table-bordered text-center">
                    <thead>
                      <tr>
                        <th>#Patch</th>
                        <th>Location</th>
                        <th>Damage Type</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedItem.repairOperations.map((repair: any) => (
                        <tr key={repair.lineNumber}>
                          <td>{repair.lineNumber}</td>
                          <td>{repair.repairLocation}</td>
                          <td>{repair.repairType}</td>
                          <td>{repair.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {/* Retread Details */}
              <table className="table table-bordered mt-3">
                <tbody>
                  <tr>
                    <td width="40%">
                      <strong>Requested Pattern</strong>
                    </td>
                    <td>{selectedItem.requestedPattern}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Approved Pattern</strong>
                    </td>
                    <td>{selectedItem.approvedPattern}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Approved Pattern with Tread Width</strong>
                    </td>
                    <td>{selectedItem.treadWidth}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Reason</strong>
                    </td>
                    <td>{selectedItem.reason || "-"}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Approved Date</strong>
                    </td>
                    <td>
                      {selectedItem.receivedDate
                        ? new Date(
                            selectedItem.receivedDate,
                          ).toLocaleDateString("en-GB")
                        : "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-6 p-3">
          <div className="panel-box">
            <div className="panel-body p-3">
              {/* STEP 1 */}
              <div className="card p-3 mb-3">
                <h5 className="text-center mb-4">1. Initial QC Decision</h5>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={decision === "approve"}
                    onChange={() => {
                      setDecision("approve");
                      setDestinationStage(null);
                      setRecoverDecision(null);
                    }}
                  />

                  <label className="form-check-label">Approve → Dispatch</label>
                </div>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={decision === "recoverRubber"}
                    onChange={() => {
                      setDecision("recoverRubber");
                      setDestinationStage(null);
                    }}
                  />

                  <label className="form-check-label">Recover Rubber</label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={decision === "destination"}
                    onChange={() => {
                      setDecision("destination");
                      setRecoverDecision(null);
                    }}
                  />

                  <label className="form-check-label">Reprocess</label>
                </div>
              </div>
              {/* STEP 2 */}
              {decision === "recoverRubber" && (
                <div className="card p-3 mb-3">
                  <h5>Recover Rubber Decision</h5>

                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      checked={recoverDecision === "approved"}
                      onChange={() => setRecoverDecision("approved")}
                    />

                    <label className="form-check-label">
                      Approved → Dispatch
                    </label>
                  </div>

                  <div className="form-check mt-3">
                    <input
                      type="radio"
                      className="form-check-input"
                      checked={recoverDecision === "rejected"}
                      onChange={() => setRecoverDecision("rejected")}
                    />

                    <label className="form-check-label">
                      Send To → PreBuffing
                    </label>
                  </div>
                </div>
              )}
              {decision === "destination" && (
                <div className="card p-3 mb-3">
                  <h5>Destination Stage</h5>

                  {/* Show only when there are NO repair details */}
                  {(!selectedItem.repairOperations ||
                    selectedItem.repairOperations.length === 0) && (
                    <div className="form-check mb-2">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="destinationStage"
                        checked={destinationStage === 8}
                        onChange={() => setDestinationStage(8)}
                      />
                      <label className="form-check-label">
                        Send To Skiving
                      </label>
                    </div>
                  )}

                  {/* Show only when repair details exist */}
                  {selectedItem.repairOperations &&
                    selectedItem.repairOperations.length > 0 && (
                      <div className="form-check mb-2">
                        <input
                          type="radio"
                          className="form-check-input"
                          name="destinationStage"
                          checked={destinationStage === 10}
                          onChange={() => setDestinationStage(10)}
                        />
                        <label className="form-check-label">
                          Send To Repair
                        </label>
                      </div>
                    )}

                  {/* Always show Dispatch */}
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="destinationStage"
                      checked={destinationStage === 16}
                      onChange={() => setDestinationStage(16)}
                    />
                    <label className="form-check-label">Send To Dispatch</label>
                  </div>
                </div>
              )}
              {destinationStage !== null && (
                <div className="card p-3 mb-3">
                  <label className="fw-semibold">Rejection Reason</label>

                  <select
                    className="form-select"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  >
                    <option value="">Select Reason</option>

                    {rejectionReasons.map((reason) => (
                      <option key={reason.code} value={reason.code}>
                        {reason.reason}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Submit */}
              <button
                className="btn btn-danger w-100"
                onClick={handleSubmit}
                disabled={processing}
              >
                {processing ? "Submitting..." : "Submit QC Decision"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {processing && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(255,255,255,0.6)",
            zIndex: 99999,
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      )}
    </>
  );
};

export default QualityControlRetreadModal;
