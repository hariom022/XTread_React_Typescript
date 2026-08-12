import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import visualInspectionService from "../service/visualInspectionService";
import VisualChecklistModal from "./VisualChecklistModal";
import "../styles/VisualInspect.css";

type Props = {
  item: any;
  rejectionReasons: any[];
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

const VisualInspectionModal = ({
  item,
  rejectionReasons,
  onClose,
  onSuccess,
}: Props) => {
  const [showChecklist, setShowChecklist] = useState(false);

  const [checkedChecklist, setCheckedChecklist] = useState<string[]>([]);

  const [reason, setReason] = useState<any>(null);

  const [saving, setSaving] = useState(false);

  const [retreadBackup, setRetreadBackup] = useState<any>(null);

  const [isRetreaded, setIsRetreaded] = useState(false);

  const [previousPattern, setPreviousPattern] = useState("");

  const [previousRetreader, setPreviousRetreader] = useState("");

  const [noOfRetread, setNoOfRetread] = useState<any>("");

  const [noOfExistingRepairs, setNoOfExistingRepairs] = useState<any>("");

  const totalChecklistItems = 10;

  const isChecklistComplete = checkedChecklist.length === totalChecklistItems;

  useEffect(() => {
    if (!item) return;

    const prefill = {
      isRetreaded: item.isRetreaded === true || item.isRetreaded === 1,

      previousPattern: item.previousPattern || "",

      previousRetreader: item.previousRetreader || "",

      noOfRetread: item.noOfRetread || "",

      noOfExistingRepairs:
        item.existingRepairsCount || item.noOfExistingRepairs || "",
    };

    setRetreadBackup(prefill);

    setIsRetreaded(prefill.isRetreaded);

    setPreviousPattern(prefill.previousPattern);

    setPreviousRetreader(prefill.previousRetreader);

    setNoOfRetread(prefill.noOfRetread);

    setNoOfExistingRepairs(prefill.noOfExistingRepairs);
  }, [item]);

  const handleRejectionReasonChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selected = rejectionReasons.find(
      (x: any) => x.rejectionReasonId === Number(e.target.value),
    );

    setReason(selected);
  };

  const handleApproveReject = async (isApproved: boolean) => {
    try {
      if (!isChecklistComplete) {
        alert("Please complete Visual Inspection Checklist");
        return;
      }

      if (!isApproved && !reason?.rejectionReasonId) {
        alert("Please select rejection reason");
        return;
      }

      setSaving(true);

      const payload = {
        orderCasingIds: [String(item?.orderCasingId || item?.id)],

        isApproved,

        rejectionReasonId: isApproved ? null : reason?.rejectionReasonId,
      };

      console.log("Approval Payload", payload);

      await visualInspectionService.handleApprovalRejection(payload);

      await onSuccess();

      alert(isApproved ? "Approved Successfully" : "Rejected Successfully");

      onClose();
    } catch (err) {
      console.error(err);

      alert("Failed to process request");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* SAVE LOADER */}
      {saving && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 99999,
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      )}

      <div
        className={`modal fade show ${showChecklist ? "blur-background" : ""}`}
        style={{
          display: "block",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content nail-modal">
            {/* HEADER */}
            <div className="modal-header nail-header">
              <h5 className="modal-title flex-grow-1 text-white text-start">
                VISUAL INSPECTION – APPROVAL
              </h5>

              <div className="me-3 text-white text-end">
                <div>John</div>
              </div>

              <button
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={saving}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* TOP INFO */}
              <div className="mb-2">
                <div className="modal-info m-0 p-1 mb-1 postbuff-top row text-nowrap">
                  <div className="col">
                    <strong>Production No</strong>
                    <div>{item?.casing}</div>
                  </div>

                  <div className="col">
                    <strong>Tyre Ref No</strong>
                    <div>{item?.serial}</div>
                  </div>

                  <div className="col">
                    <strong>Customer Name</strong>
                    <div>{item?.customerName}</div>
                  </div>

                  <div className="col">
                    <strong>Tyre Size</strong>
                    <div>{item?.tyreSize}</div>
                  </div>

                  <div className="col">
                    <strong>Requested Pattern</strong>
                    <div>{item?.requestedPattern}</div>
                  </div>
                </div>
              </div>

              {(item?.serviceType?.name === "Retread" ||
                item?.serviceType?.name === "Repair" ||
                item?.service === "Retread" ||
                item?.service === "Repair") && (
                <div className="mt-3">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <button
                        className="open-checklist-btn w-100"
                        onClick={() => setShowChecklist(true)}
                      >
                        Visual Inspection Checklist
                      </button>
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold">Is Retreaded</label>

                      <div>
                        <input
                          type="checkbox"
                          checked={isRetreaded}
                          onChange={(e) => {
                            const checked = e.target.checked;

                            setIsRetreaded(checked);

                            if (!checked) {
                              setPreviousPattern("");
                              setPreviousRetreader("");
                              setNoOfRetread("");
                              setNoOfExistingRepairs("");
                            } else if (retreadBackup) {
                              setPreviousPattern(retreadBackup.previousPattern);

                              setPreviousRetreader(
                                retreadBackup.previousRetreader,
                              );

                              setNoOfRetread(retreadBackup.noOfRetread);

                              setNoOfExistingRepairs(
                                retreadBackup.noOfExistingRepairs,
                              );
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {isRetreaded && (
                    <>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label>Previous Pattern</label>

                          <input
                            className="form-control"
                            value={previousPattern}
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Previous Retreader</label>

                          <input
                            className="form-control"
                            value={previousRetreader}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-md-6">
                          <label>No Of Retreads</label>

                          <input
                            className="form-control"
                            value={noOfRetread}
                            readOnly
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Existing Repairs</label>

                          <input
                            className="form-control"
                            value={noOfExistingRepairs}
                            readOnly
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* REJECTION */}
              <div className="mt-3">
                <label className="fw-semibold">Rejection Reason</label>

                <select
                  className="form-select"
                  onChange={handleRejectionReasonChange}
                  disabled={saving}
                >
                  <option value="">--- Select Reason ---</option>

                  {rejectionReasons.map((item: any) => (
                    <option
                      key={item.rejectionReasonId}
                      value={item.rejectionReasonId}
                    >
                      {item.reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* BUTTONS */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <button
                    disabled={saving}
                    className="btn-approve w-100 border-0"
                    onClick={() => handleApproveReject(true)}
                  >
                    APPROVED
                  </button>
                </div>

                <div className="col-md-6">
                  <button
                    disabled={saving}
                    className="btn-reject w-100 border-0"
                    style={{ padding: "20px" }}
                    onClick={() => handleApproveReject(false)}
                  >
                    REJECTED
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showChecklist && (
        <VisualChecklistModal
          checkedChecklist={checkedChecklist}
          setCheckedChecklist={setCheckedChecklist}
          onClose={() => setShowChecklist(false)}
        />
      )}
    </>
  );
};

export default VisualInspectionModal;
