import { useState } from "react";
import { createPortal } from "react-dom";

import pressureTestService from "../services/pressureTestService";

import pressureTestServiceApi from "../services/pressureTestService";
import { usePressureTestDetails } from "../hooks/usePressureTestDetails";
// import { PRESSURE_TEST_CHECKLIST } from "../constants/pressureTestCheckList";
import { PRESSURE_TEST_CHECKLIST } from "../constants/pressureTestCheckList";
import { useEffect } from "react";
import { RingLoader } from "react-spinners";
type Props = {
  selectedItem: any;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

const PressureTestModal = ({ selectedItem, onClose, onSuccess }: Props) => {
  const { details, loading } = usePressureTestDetails(selectedItem?.id);

  const [reason, setReason] = useState("");

  const [checklistSaved, setChecklistSaved] = useState(false);

  const [showChecklist, setShowChecklist] = useState(false);

  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);

  const [rejectionReasons, setRejectionReasons] = useState<any[]>([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    loadRejectionReasons();
  }, []);

  const loadRejectionReasons = async () => {
    try {
      const result = await pressureTestServiceApi.getRejectionReason();

      setRejectionReasons(result?.data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleChecklist = (id: string) => {
    setSelectedChecks((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleApprove = async () => {
    if (!checklistSaved) {
      alert("Please complete all checklist items before approval");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = {
        orderCasingIds: [selectedItem.orderCasingId.toString()],
        isApproved: true,
        rejectionReasonCode: "",
      };

      await pressureTestServiceApi.handleApprovalRejection(payload);

      alert("Pressure Test Approved Successfully");

      await onSuccess();

      onClose();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to approve");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReject = async () => {
    if (!checklistSaved) {
      alert("Please complete all checklist items before rejection");
      return;
    }

    if (!reason) {
      alert("Please select rejection reason");
      return;
    }

    try {
      setSubmitLoading(true);

      const payload = {
        orderCasingIds: [selectedItem.orderCasingId.toString()],
        isApproved: false,
        rejectionReasonCode: reason,
      };

      await pressureTestServiceApi.handleApprovalRejection(payload);

      alert("Pressure Test Rejected Successfully");

      await onSuccess();

      onClose();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to reject");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{
          display: "block",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content nail-modal">
            <div className="modal-header nail-header">
              <h5 className="modal-title w-100">PRESSURE TEST – APPROVAL</h5>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <div className="modal-body">
              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    minHeight: "350px",
                  }}
                >
                  <RingLoader color="#b30815" size={80} />
                </div>
              ) : (
                <>
                  <div className="modal-info m-0 p-2 building-top row text-nowrap">
                    <div className="col">
                      <strong>Production No</strong>
                      <div>{details?.productionNumber}</div>
                    </div>

                    <div className="col">
                      <strong>Tyre Ref No</strong>
                      <div>{details?.tyreReferenceNumber}</div>
                    </div>

                    <div className="col">
                      <strong>Customer</strong>
                      <div>{selectedItem?.customerName}</div>
                    </div>

                    <div className="col">
                      <strong>Tyre Size</strong>
                      <div>{details?.tyreSize?.casingSize}</div>
                    </div>

                    <div className="col">
                      <strong>Pattern</strong>
                      <div>{details?.retreadDetail?.patternName}</div>
                    </div>
                  </div>

                  <div className="section-card mt-3">
                    <div className="section-body">
                      <div className="row">
                        <div className="col-md-6">
                          <button
                            className="open-checklist-btn w-100"
                            onClick={() => setShowChecklist(true)}
                          >
                            Pressure Test Checklist
                          </button>
                        </div>

                        <div className="col-md-6">
                          <select
                            className="form-select"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          >
                            <option value="">Select Rejection Reason</option>

                            {rejectionReasons.map((item) => (
                              <option
                                key={item.rejectionReasonId}
                                value={item.code}
                              >
                                {item.reason}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <button
                        className="btn btn-approve w-100"
                        onClick={handleApprove}
                      >
                        APPROVED
                      </button>
                    </div>

                    <div className="col-md-6">
                      <button
                        className="btn btn-reject w-100"
                        onClick={handleReject}
                      >
                        REJECTED
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showChecklist &&
        createPortal(
          <>
            <div className="modal-backdrop fade show" />

            <div
              className="modal d-block"
              style={{
                zIndex: 1060,
              }}
            >
              <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header nail-header">
                    <h5 className="modal-title">Pressure Test Checklist</h5>

                    <button
                      className="btn-close btn-close-white"
                      onClick={() => setShowChecklist(false)}
                    />
                  </div>

                  <div className="modal-body">
                    <table className="table table-bordered">
                      <tbody>
                        {PRESSURE_TEST_CHECKLIST.checklist.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <input
                                type="checkbox"
                                className="me-2"
                                checked={selectedChecks.includes(item.id)}
                                onChange={() => toggleChecklist(item.id)}
                              />
                              {item.label}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => {
                        if (
                          selectedChecks.length !==
                          PRESSURE_TEST_CHECKLIST.checklist.length
                        ) {
                          alert("Please complete all checklist items");
                          return;
                        }

                        setChecklistSaved(true);

                        setShowChecklist(false);
                      }}
                    >
                      Save Checklist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
      {submitLoading && (
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
    </>
  );
};

export default PressureTestModal;
