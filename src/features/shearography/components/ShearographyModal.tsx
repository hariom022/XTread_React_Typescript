import { useState } from "react";

import PdfUpload from "./PdfUpload";
import ShearographyChecklistModal from "./ShearographyChecklistModal";

import { SHEAROGRAPHY_CHECKLIST } from "../constants/shearographyChecklist";

import shearographyService from "../service/shearographyService";
import { useAuthStore } from "../../auth/store/authStore";

type Props = {
  item: any;
  rejectionReasons: any[];
  onClose: () => void;
  onSuccess: () => void;
};

const ShearographyModal = ({
  item,
  rejectionReasons,
  onClose,
  onSuccess,
}: Props) => {
  const user = useAuthStore((state) => state.user);
  const [reason, setReason] = useState("");

  const [showChecklist, setShowChecklist] = useState(false);

  const [checklistSaved, setChecklistSaved] = useState(false);

  const [checkedChecklist, setCheckedChecklist] = useState<string[]>([]);

  const [selectAllChecklist, setSelectAllChecklist] = useState(false);

  const [pdfFiles, setPdfFiles] = useState<any[]>([]);

  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [showHoldOptions, setShowHoldOptions] = useState(false);

  const toggleChecklist = (id: string) => {
    setCheckedChecklist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];

      setSelectAllChecklist(updated.length === SHEAROGRAPHY_CHECKLIST.length);

      return updated;
    });
  };

  const handleSelectAllChecklist = () => {
    if (selectAllChecklist) {
      setCheckedChecklist([]);
      setSelectAllChecklist(false);
    } else {
      setCheckedChecklist(SHEAROGRAPHY_CHECKLIST.map((x) => x.id));

      setSelectAllChecklist(true);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newFiles = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPdfFiles((prev) => [...prev, ...newFiles]);
  };

  const removePdf = (index: number) => {
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handleLPOHold = async () => {
    try {
      const payload = {
        orderCasingId: item.id.toString(),
        casingStage: 6,
        holdType: 1,
      };

      console.log("LPO Hold Payload:", payload);

      await shearographyService.createHold(payload);

      alert("Hold created for Awaiting Customer LPO");

      setShowHoldOptions(false);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("LPO Hold Error:", error);
      console.error("LPO Hold Response:", error?.response?.data);

      const responseData = error?.response?.data;

      alert(
        responseData?.message ||
        responseData?.error?.message ||
        responseData?.error ||
        JSON.stringify(responseData) ||
        "Failed to create LPO hold"
      );
    }
  };

  const handlePaymentHold = async () => {
    try {
      const payload = {
        orderCasingId: item.id.toString(),
        casingStage: 6,
        holdType: 2,
      };

      console.log("Payment Hold Payload:", payload);

      await shearographyService.createHold(payload);

      alert("Hold created for Payment");

      setShowHoldOptions(false);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Payment Hold Error:", error);

      alert(
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to create Payment hold"
      );
    }
  };
  const handleApprove = async () => {
    if (!checklistSaved) {
      alert("Please complete checklist first");
      return;
    }

    const formData = new FormData();

    formData.append("orderCasingIds", item.id);

    formData.append("isApproved", "true");

    pdfFiles.forEach((pdf) => {
      formData.append("pdfs", pdf.file);
    });

    await shearographyService.handleApprovalRejection(formData);

    alert("Approved Successfully");

    onSuccess();

    onClose();
  };

  const handleReject = async () => {
    if (!reason) {
      alert("Please select rejection reason");
      return;
    }

    const formData = new FormData();

    formData.append("orderCasingIds", item.id);

    formData.append("isApproved", "false");

    formData.append("rejectionReasonId", reason);

    pdfFiles.forEach((pdf) => {
      formData.append("pdfs", pdf.file);
    });

    await shearographyService.handleApprovalRejection(formData);

    alert("Rejected Successfully");

    onSuccess();

    onClose();
  };

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{
          backgroundColor: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 1040,
        }}
      />

      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div
            className={`modal-content ${showChecklist ? "blur-approval" : ""}`}
          >
            {/* HEADER */}
            <div className="modal-header shearo-header d-flex align-items-center">
              <h5 className="modal-title flex-grow-1 text-white text-start">
                SHEAROGRAPHY - APPROVAL
              </h5>
              {/* STAFF NAME */}
              <div
                className="me-3 text-white text-end" >
                <div>{user?.userName || "User"}</div>

              </div>
              {/* CLOSE (X) BUTTON */}
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Top Information */}
              <div className="modal-info m-0 building-top row text-nowrap">
                <div className="col">
                  <strong>Production No</strong>
                  <div>{item?.casing}</div>
                </div>

                <div className="col">
                  <strong>Serial No</strong>
                  <div>{item?.serial}</div>
                </div>

                <div className="col">
                  <strong>Customer Name</strong>
                  <div>{item?.customerName || "-"}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{item?.tyreSize || "-"}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>{item?.requestedPattern || item?.pattern || "-"}</div>
                </div>
              </div>

              {/* Checklist + Rejection */}
              <div className="row g-3 mt-1">
                <div className="col-md-6 d-flex align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    style={{ height: "2.75rem", }}
                    onClick={() => setShowChecklist(true)}
                  >
                    Shearography Checklist
                  </button>
                </div>

                <div className="col-md-6">
                  <select
                    className="form-select"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="" hidden>
                      Select Rejection Reason
                    </option>

                    {rejectionReasons.map((reasonItem: any) => (
                      <option
                        key={reasonItem.rejectionReasonId}
                        value={reasonItem.rejectionReasonId}
                      >
                        {reasonItem.reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PDF Upload */}
                <PdfUpload
                  pdfFiles={pdfFiles}
                  previewIndex={previewIndex}
                  setPreviewIndex={setPreviewIndex}
                  handlePdfUpload={handlePdfUpload}
                  removePdf={removePdf}
                />
              </div>

              {/* Action Buttons */}
              <div className="row g-1 mt-2">
                <div className="col-md-4">
                  <button
                    className="btn btn-warning HOLD w-100 d-flex align-items-center justify-content-center gap-3"
                    style={{
                      height: "7.25rem",
                    }}
                    onClick={() => setShowHoldOptions(true)}
                  >
                    <span>HOLD – Awaiting Customer LPO</span>

                    <span className="icon-box">
                      <i className="bi bi-pause-circle"></i>
                    </span>
                  </button>
                </div>

                <div className="col-md-4">
                  <button
                    className="btn btn-approve w-100 d-flex align-items-center justify-content-center gap-3"
                    onClick={handleApprove}
                  >
                    <span>APPROVED</span>

                    <span className="icon-box">
                      <i className="bi bi-check-lg"></i>
                    </span>
                  </button>
                </div>

                <div className="col-md-4">
                  <button
                    className="btn btn-reject w-100 d-flex align-items-center justify-content-center gap-3"
                    onClick={handleReject}
                  >
                    <span>REJECTED</span>

                    <span className="icon-box">
                      <i className="bi bi-x-lg"></i>
                    </span>
                  </button>
                </div>
              </div>
              {/* HOLD OPTIONS MODAL */}
              {showHoldOptions && (
                <>
                  <div
                    className="modal-backdrop fade show"
                    style={{
                      zIndex: 1060,
                      backgroundColor: "rgba(0,0,0,0.45)",
                    }}
                  ></div>

                  <div
                    className="modal fade show d-block"
                    tabIndex={-1}
                    style={{ zIndex: 1065 }}
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">

                        <div className="modal-header">
                          <h5 className="modal-title">
                            Hold – Awaiting Customer LPO
                          </h5>

                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowHoldOptions(false)}
                          ></button>
                        </div>

                        <div className="modal-body">
                          <div className="row g-3">

                            {/* LPO */}
                            <div className="col-6">
                              <button
                                type="button"
                                className="btn btn-primary w-100"
                                style={{ height: "60px" }}
                                onClick={handleLPOHold}
                              >
                                <b>LPO</b>
                              </button>
                            </div>

                            {/* PAYMENT */}
                            <div className="col-6">
                              <button
                                type="button"
                                className="btn btn-success w-100"
                                style={{ height: "60px" }}
                                onClick={handlePaymentHold}
                              >
                                <b>Payment</b>
                              </button>
                            </div>

                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Checklist Modal */}
      {
        showChecklist && (
          <ShearographyChecklistModal
            show={showChecklist}
            checkedChecklist={checkedChecklist}
            selectAllChecklist={selectAllChecklist}
            setChecklistSaved={setChecklistSaved}
            setShow={setShowChecklist}
            toggleChecklist={toggleChecklist}
            handleSelectAllChecklist={handleSelectAllChecklist}
            resetChecklist={() => setShowChecklist(false)}
          />
        )
      }
    </>
  );
};

export default ShearographyModal;