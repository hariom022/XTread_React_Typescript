import { useEffect } from "react";
import { createPortal } from "react-dom";
import { PRE_BUFFING_CHECKLIST } from "../constants/preBuffingCheckList";
import PreBuffingChecklist from "../components/PreBuffingCheckList";

interface Variant {
  treadPatternVariantId: number;
  width: string;
}

interface Pattern {
  treadPatternId: number;
  patternName: string;
  brand: string;
  variants: Variant[];
}

interface Reason {
  rejectionReasonId: number;
  code: string;
  reason: string;
}

interface SelectedItem {
  id: number;
  casing: string;
  serial: string;
  customerName: string;
  tyreSize: string;

  tyreMake?: string;
  model?: string;
  brand?: string;
  width?: string;

  requestedPattern: string;
}

interface Props {
  approvalModalRef: React.RefObject<HTMLDivElement | null>;

  selected: SelectedItem;

  reason: string;
  setReason: React.Dispatch<React.SetStateAction<string>>;

  holdReason: string;
  setHoldReason: React.Dispatch<React.SetStateAction<string>>;

  rejectionReasons: Reason[];
  holdReasons: Reason[];

  patterns: Pattern[];

  selectedPatternId: string;
  setSelectedPatternId: React.Dispatch<React.SetStateAction<string>>;

  selectedVariantId: number | "";
  setSelectedVariantId: React.Dispatch<React.SetStateAction<number | "">>;

  selectedBrand: string;
  setSelectedBrand: React.Dispatch<React.SetStateAction<string>>;

  setSelectedWidth: React.Dispatch<React.SetStateAction<string>>;
  showChecklist: boolean;

  setShowChecklist: React.Dispatch<React.SetStateAction<boolean>>;

  checkedChecklist: string[];

  toggleChecklist: (id: string) => void;

  selectAllChecklist: boolean;

  handleSelectAllChecklist: () => void;

  isChecklistComplete: boolean;

  checklistSaved: boolean;

  setChecklistSaved: React.Dispatch<React.SetStateAction<boolean>>;
  // showChecklist: boolean;
  // setShowChecklist: React.Dispatch<
  //   React.SetStateAction<boolean>
  // >;

  // checkedChecklist: string[];

  // toggleChecklist: (id: string) => void;

  // selectAllChecklist: boolean;

  // handleSelectAllChecklist: () => void;

  // setChecklistSaved: React.Dispatch<
  //   React.SetStateAction<boolean>
  // >;

  handleApprove: () => void;
  handleReject: () => void;
  handleHold: () => void;

  resetModal: () => void;
}

const PreBuffingApprovalModal = ({
  checklistSaved,
  setChecklistSaved,
  approvalModalRef,
  selected,

  reason,
  setReason,

  holdReason,
  setHoldReason,

  rejectionReasons,
  holdReasons,

  patterns,

  selectedPatternId,
  setSelectedPatternId,

  selectedVariantId,
  setSelectedVariantId,

  selectedBrand,
  setSelectedBrand,

  setSelectedWidth,

  // showChecklist,
  // setShowChecklist,

  // checkedChecklist,
  // toggleChecklist,

  // selectAllChecklist,
  // handleSelectAllChecklist,

  // setChecklistSaved,

  handleApprove,
  handleReject,
  handleHold,

  resetModal,
  showChecklist,
  setShowChecklist,

  checkedChecklist,
  toggleChecklist,

  selectAllChecklist,
  handleSelectAllChecklist,

  isChecklistComplete,
}: Props) => {
  console.log("showChecklist", showChecklist);
  console.log("setShowChecklist", setShowChecklist);
  console.log("typeof setShowChecklist", typeof setShowChecklist);
  return (
    <>
      <div
        className="modal fade"
        ref={approvalModalRef}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content prebuffer-modal">
            {/* HEADER */}

            <div className="modal-header">
              <h5 className="modal-title mb-0">PRE BUFFING - APPROVAL</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={resetModal}
              />
            </div>

            {/* BODY */}

            <div className="modal-body">
              {/* TOP INFO */}

              <div className="modal-info m-0 p-2 prebuffer-top row text-nowrap">
                <div className="col">
                  <strong>Production No</strong>
                  <div>{selected?.casing}</div>
                </div>

                <div className="col">
                  <strong>Serial No</strong>
                  <div>{selected?.serial}</div>
                </div>

                <div className="col">
                  <strong>Customer Name</strong>
                  <div>{selected?.customerName}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{selected?.tyreSize}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>{selected?.requestedPattern}</div>
                </div>
              </div>

              {/* Suggest New Pattern */}
              <div className="container">
                <div className="row g-2">
                  {/* LEFT PANEL */}
                  <div className="col-md-6">
                    <div className="panel-box p-2">
                      <div className="panel-header py-1 small fw-bold">
                        MATERIAL AVAILABILITY
                      </div>

                      <div className="panel-body p-2">
                        <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                          {/* Available KGs */}
                          <div className="d-flex align-items-center gap-1">
                            <small className="fw-bold">Available KGs</small>
                            <span className="value-box text-danger small">
                              4,584.95
                            </span>
                          </div>

                          {/* Approx Casings */}
                          <div className="d-flex align-items-center gap-1">
                            <small className="fw-bold">Approx. Casings</small>
                            <span className="value-box text-danger small">
                              371
                            </span>
                          </div>

                          {/* Helper text */}
                          <div className="small text-muted">
                            Rubber/KG: <b>12.38</b>
                            <em className="ms-2 d-none d-md-inline">
                              (* Estimated with circumference of 3,000)
                            </em>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right PANEL */}
                  <div className="col-md-6">
                    <div className="panel-box h-80 p-0">
                      <div className="panel-body p-3">
                        <div className="record-box p-13">
                          <div className="record-header small fw-bold mb-2">
                            Record [1 of 1]
                          </div>

                          <div className="row gx-5 gy-1 small">
                            <div className="col-4 record-item">
                              <b>Tyre Size:</b> {selected?.tyreSize}
                            </div>
                            <div className="col-4 record-item">
                              <b>Make:</b> {selected?.tyreMake}
                            </div>

                            <div className="col-4 record-item">
                              <b>Model:</b> {selected?.model}
                            </div>
                            <div className="col-4 record-item">
                              <b>Brand:</b> {selected?.brand}
                            </div>

                            <div className="col-4 record-item">
                              <b>Pattern:</b> {selected?.requestedPattern}
                            </div>
                            <div className="col-4 record-item">
                              <b>Width:</b> {selected?.width}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row g-3 align-items-end mt-2">
                  <div className="col">
                    <label className="form-label">Holding Reason</label>

                    <select
                      className="form-select"
                      value={holdReason}
                      onChange={(e) => setHoldReason(e.target.value)}
                    >
                      <option value="">Select Hold Reason</option>

                      {holdReasons.map((item) => (
                        <option key={item.rejectionReasonId} value={item.code}>
                          {item.reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pattern */}

                  <div className="col">
                    <label className="form-label">Pattern</label>

                    <select
                      className="form-select"
                      value={selectedPatternId}
                      onChange={(e) => {
                        const patternId = e.target.value;

                        setSelectedPatternId(patternId);

                        const pattern = patterns.find(
                          (x) => String(x.treadPatternId) === patternId,
                        );

                        if (pattern) {
                          setSelectedBrand(pattern.brand);

                          setSelectedVariantId("");

                          setSelectedWidth("");
                        }
                      }}
                    >
                      <option value="">Select Pattern</option>

                      {patterns.map((item) => (
                        <option
                          key={item.treadPatternId}
                          value={item.treadPatternId}
                        >
                          {item.patternName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Width */}

                  <div className="col">
                    <label className="form-label">Width</label>

                    <select
                      className="form-select"
                      value={selectedVariantId}
                      onChange={(e) => {
                        const variantId = Number(e.target.value);

                        setSelectedVariantId(variantId);

                        const pattern = patterns.find(
                          (p) => String(p.treadPatternId) === selectedPatternId,
                        );

                        const variant = pattern?.variants?.find(
                          (v) => v.treadPatternVariantId === variantId,
                        );

                        if (variant) {
                          setSelectedWidth(variant.width);
                        }
                      }}
                    >
                      <option value="">Select Width</option>

                      {patterns
                        .find(
                          (p) => String(p.treadPatternId) === selectedPatternId,
                        )
                        ?.variants?.map((variant) => (
                          <option
                            key={variant.treadPatternVariantId}
                            value={variant.treadPatternVariantId}
                          >
                            {variant.width}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Brand */}

                  <div className="col">
                    <label className="form-label">Brand</label>

                    <input
                      className="form-control"
                      value={selectedBrand}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              {/* Rejection Reason */}

              <div className="mt-3">
                <label className="form-label">Rejection Reason</label>

                <select
                  className="form-select"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select Rejection Reason</option>

                  {rejectionReasons.map((item) => (
                    <option key={item.rejectionReasonId} value={item.code}>
                      {item.reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTION BUTTONS */}

              <div className="row g-2 mt-3">
                <div className="col-md-3">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => {
                      console.log("Checklist Button Clicked");
                      setShowChecklist(true);
                    }}
                  >
                    Pre-Buffing Checklist
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-reject w-100"
                    onClick={() => {
                      if (!isChecklistComplete) {
                        alert(
                          "Please complete Pre Buffing Checklist before Rejection",
                        );
                        return;
                      }

                      handleReject();
                    }}
                  >
                    REJECTED
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-warning w-100"
                    onClick={() => {
                      if (!isChecklistComplete) {
                        alert(
                          "Please complete Pre Buffing Checklist before Hold",
                        );
                        return;
                      }

                      handleHold();
                    }}
                  >
                    HOLD
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-approve w-100"
                    onClick={() => {
                      if (!isChecklistComplete) {
                        alert(
                          "Please complete Pre Buffing Checklist before Approval",
                        );
                        return;
                      }

                      handleApprove();
                    }}
                  >
                    APPROVED
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHECKLIST MODAL */}

      <PreBuffingChecklist
        show={showChecklist}
        checkedChecklist={checkedChecklist}
        toggleChecklist={toggleChecklist}
        selectAllChecklist={selectAllChecklist}
        handleSelectAllChecklist={handleSelectAllChecklist}
        onClose={() => setShowChecklist(false)}
        onSave={() => {
          if (!isChecklistComplete) {
            alert("Please complete all checklist items");
            return;
          }

          setChecklistSaved(true);

          setShowChecklist(false);
        }}
      />
    </>
  );
};

export default PreBuffingApprovalModal;
