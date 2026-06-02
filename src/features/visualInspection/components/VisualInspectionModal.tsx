import { useEffect, useState } from "react";
import visualInspectionService from "../service/visualInspectionService";
import VisualChecklistModal from "./VisualChecklistModal";

type Props = {
  item: any;
  rejectionReasons: any[];
  onClose: () => void;
  onSuccess: () => void;
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

      noOfExistingRepairs: item.noOfExistingRepairs || "",
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

      if (!isApproved && !reason?.code) {
        alert("Please select rejection reason");
        return;
      }

      const payload = {
        orderCasingIds: [String(item?.id)],

        isApproved,

        rejectionReasonCode: isApproved ? null : reason?.code,
      };

      await visualInspectionService.handleApprovalRejection(payload);

      alert(isApproved ? "Approved Successfully" : "Rejected Successfully");

      onSuccess();

      onClose();
    } catch (err) {
      console.error(err);

      alert("Failed to process request");
    }
  };

  return (
    <>
      <div
  className={`modal fade show ${
    showChecklist ? "blur-background" : ""
  }`}
  style={{
    display: "block",
    background: "rgba(0,0,0,0.5)",
  }}
>
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content nail-modal">
            {/* HEADER */}

            <div className="modal-header nail-header">
              <h4 className="modal-title fw-bold">
                VISUAL INSPECTION – APPROVAL
              </h4>

              <div className="ms-auto me-3 text-white fw-bold">John</div>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            {/* BODY */}

            <div className="modal-body">
              {/* TOP INFO */}

              <div className="modal-info">
                <div>
                  <strong>Production No</strong>

                  <div>{item?.casing}</div>
                </div>

                <div>
                  <strong>Tyre Ref No</strong>

                  <div>{item?.serial}</div>
                </div>

                <div>
                  <strong>Customer Name</strong>

                  <div>{item?.customerName}</div>
                </div>

                <div>
                  <strong>Tyre Size</strong>

                  <div>{item?.tyreSize}</div>
                </div>

                <div>
                  <strong>Requested Pattern</strong>

                  <div>{item?.requestedPattern || item?.pattern}</div>
                </div>
              </div>

              {/* RETREAD SECTION */}

              {(item?.service === "Retread" || item?.service === "Repair") && (
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
                            onChange={(e) => setPreviousPattern(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label>Previous Retreader</label>

                          <input
                            className="form-control"
                            value={previousRetreader}
                            onChange={(e) =>
                              setPreviousRetreader(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="row mt-2">
                        <div className="col-md-6">
                          <label>No Of Retreads</label>

                          <input
                            type="number"
                            className="form-control"
                            value={noOfRetread}
                            onChange={(e) => setNoOfRetread(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6">
                          <label>No Of Existing Repairs</label>

                          <input
                            type="number"
                            className="form-control"
                            value={noOfExistingRepairs}
                            onChange={(e) =>
                              setNoOfExistingRepairs(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* REJECTION REASON */}

              <div className="mt-3">
                <label className="fw-semibold">Rejection Reason</label>

                <select
                  className="form-select"
                  onChange={handleRejectionReasonChange}
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

              {/* APPROVE / REJECT */}

              <div className="row mt-4">
                <div className="col-md-6">
                  <button
                    className="btn-approve w-100 border-0"
                    onClick={() => handleApproveReject(true)}
                  >
                    APPROVED
                  </button>
                </div>

                <div className="col-md-6">
                  <button
                    className="btn-reject w-100 border-0"
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
