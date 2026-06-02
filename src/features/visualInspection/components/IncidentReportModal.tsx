import { useRef, useState } from "react";

type Props = {
  onClose: () => void;
};

const IncidentReportModal = ({ onClose }: Props) => {
  const incidentCloseRef = useRef<HTMLButtonElement | null>(null);

  const [incidentReason, setIncidentReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [incidentReport, setIncidentReport] = useState("");

  const handleIncidentSubmit = () => {
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

    // TODO API Call

    alert("Incident Submitted Successfully ✅");

    setIncidentReason("");
    setOtherReason("");
    setIncidentReport("");

    onClose();
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header incident-header">
            <h5 className="modal-title">
              Incident Reporting / Machine Failure
            </h5>

            <button className="btn-close btn-close-black" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            {/* INCIDENT REASON */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Incident Reason</label>

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

            {/* OTHER REASON */}
            {incidentReason === "Other" && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Specify Reason</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter reason..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                />
              </div>
            )}

            {/* COMMENT */}
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

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleIncidentSubmit}>
              Submit Incident
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReportModal;
