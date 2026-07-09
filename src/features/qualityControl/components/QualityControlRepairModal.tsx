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

const QualityControlRepairModal = ({
  selectedItem,
  rejectReason,
  setRejectReason,
  rejectionReasons,
  rejectComment,
  setRejectComment,
  onApprove,
}: Props) => {
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(
    null,
  );

  const [recoverDecision, setRecoverDecision] = useState<
    "dispatch" | "repair" | null
  >(null);
  const [processing, setProcessing] = useState(false);
  if (!selectedItem) return null;

  const handleSubmit = async () => {
    try {
      setProcessing(true);
      let payload = null;
      let successMessage = "";

      // Approved -> Dispatch
      if (decision === "approved") {
        payload = buildQualityControlRequest(
          selectedItem.orderCasingId,
          "APPROVE",
        );

        successMessage = "Tyre approved and moved to Dispatch.";
      }

      // Rejected -> Dispatch
      else if (decision === "rejected" && recoverDecision === "dispatch") {
        if (!rejectReason) {
          alert("Please select a rejection reason.");
          return;
        }

        payload = buildQualityControlRequest(
          selectedItem.orderCasingId,
          "SEND_TO_DISPATCH",
          rejectReason,
        );

        successMessage = "Tyre rejected and moved to Dispatch.";
      }

      // Rejected -> Return to Repair
      else if (decision === "rejected" && recoverDecision === "repair") {
        if (!rejectReason) {
          alert("Please select a rejection reason.");
          return;
        }

        payload = buildQualityControlRequest(
          selectedItem.orderCasingId,
          "SEND_TO_REPAIR",
          rejectReason,
        );

        successMessage = "Tyre returned to Repairs.";
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
      alert("Failed to process QC decision.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="modal-info m-0 p-2 building-top row text-nowrap">
        <div className="col-2">
          <strong>Production No</strong>
          <div>{selectedItem.productionNumber}</div>
        </div>

        <div className="col-2">
          <strong>Tyre Ref No</strong>
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
          <strong>Repair Inspection</strong>
        </div>
      </div>

      <div className="row">
        {/* LEFT PANEL */}
        <div className="col-md-6 p-3">
          <div className="panel-box">
            <div className="panel-body p-3">
              <h5 className="mb-3">Repair Details</h5>

              <table className="table table-bordered text-center">
                <thead>
                  <tr>
                    <th># Patch</th>
                    <th>Location</th>
                    <th>Damage Type</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedItem.repairOperations?.length > 0 ? (
                    selectedItem.repairOperations.map((repair: any) => (
                      <tr key={repair.lineNumber}>
                        <td>{repair.lineNumber}</td>
                        <td>{repair.repairLocation}</td>
                        <td>{repair.repairType}</td>
                        <td>{repair.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        No Repair Records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* <table className="table table-bordered mt-3">
                <tbody>
                  <tr>
                    <td width="40%">
                      <strong>Service Type</strong>
                    </td>
                    <td>{selectedItem.serviceType}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Existing Repairs</strong>
                    </td>
                    <td>{selectedItem.existingRepairsCount}</td>
                  </tr>

                  <tr>
                    <td>
                      <strong>Damage Level</strong>
                    </td>
                    <td>{selectedItem.damageLevel}</td>
                  </tr>
                </tbody>
              </table> */}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-6 p-3">
          <div className="panel-box">
            <div className="panel-body p-3">
              {/* STEP 1 */}
              <div className="card p-3 mb-3">
                <h6>1. QC Inspection — Is this casing approved?</h6>

                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={decision === "approved"}
                    onChange={() => setDecision("approved")}
                  />

                  <label className="form-check-label">
                    Approved — Send to Dispatch
                  </label>
                </div>

                <div className="form-check mt-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={decision === "rejected"}
                    onChange={() => setDecision("rejected")}
                  />

                  <label className="form-check-label">
                    Move to Reject Review
                  </label>
                </div>
              </div>

              {/* STEP 2 */}
              {decision === "rejected" && (
                <div className="card p-3 mb-3">
                  <h6>2. Reject Review — Can rubber be recovered?</h6>

                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      checked={recoverDecision === "dispatch"}
                      onChange={() => setRecoverDecision("dispatch")}
                    />

                    <label className="form-check-label">send to Dispatch</label>
                  </div>

                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      checked={recoverDecision === "repair"}
                      onChange={() => setRecoverDecision("repair")}
                    />

                    <label className="form-check-label">send to Repairs</label>
                  </div>
                </div>
              )}

              {/* Reason */}
              {decision === "rejected" && (
                <div className="mb-3">
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

                  {/* <textarea
                    className="form-control mt-2"
                    rows={3}
                    placeholder="Comments"
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                  /> */}
                </div>
              )}

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

export default QualityControlRepairModal;
