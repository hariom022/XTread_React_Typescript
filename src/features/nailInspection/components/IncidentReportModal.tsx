import { useState } from "react";

type Props = {
  onClose: () => void;
};

const IncidentReportModal = ({ onClose }: Props) => {
  const [incidentReason, setIncidentReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [incidentReport, setIncidentReport] = useState("");

  const handleIncidentSubmit = async () => {
    if (!incidentReason) {
      alert("Please select incident reason");
      return;
    }

    if (incidentReason === "Other" && !otherReason.trim()) {
      alert("Please specify other reason");
      return;
    }

    if (!incidentReport.trim()) {
      alert("Please enter incident comment");
      return;
    }

    try {
      const payload = {
        reason: incidentReason === "Other" ? otherReason : incidentReason,
        comment: incidentReport,
      };

      console.log("Incident Payload:", payload);

      // TODO:
      // await incidentService.createIncident(payload);

      alert("Incident Submitted Successfully ✅");

      setIncidentReason("");
      setOtherReason("");
      setIncidentReport("");

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to submit incident");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal fade show" style={{display: "block", background:" rgba(0, 0, 0, 0.5)"}}></div>

      {/* Modal */}
      <div className="modal d-block" tabIndex={-1}  style={{display: "block", background:" rgba(0, 0, 0, 0.5)"}}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header incident-header">
              <h5 className="modal-title">
                Incident Reporting / Machine Failure
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Incident Reason */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Incident Reason
                </label>

                <select
                  className="form-select"
                  value={incidentReason}
                  onChange={(e) => {
                    const value = e.target.value;

                    setIncidentReason(value);

                    if (value !== "Other") {
                      setOtherReason("");
                    }
                  }}
                >
                  <option value="">Select Reason</option>

                  <option value="Machine Failure">Machine Failure</option>

                  <option value="Power Failure">Power Failure</option>

                  <option value="Steam Issue">Steam Issue</option>

                  <option value="Operator Mistake">Operator Mistake</option>

                  <option value="Material Issue">Material Issue</option>

                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Other Reason */}
              {incidentReason === "Other" && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Specify Reason
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter reason..."
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                  />
                </div>
              )}

              {/* Comment */}
              <div>
                <label className="form-label fw-semibold">Comment</label>

                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describe incident..."
                  value={incidentReport}
                  onChange={(e) => setIncidentReport(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button className="btn btn-danger" onClick={handleIncidentSubmit}>
                Submit Incident
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncidentReportModal;
