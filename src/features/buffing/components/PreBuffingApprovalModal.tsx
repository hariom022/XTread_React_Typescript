import PreBuffingChecklist from "../components/PreBuffingCheckList";
import type { OrderCasingDetails } from "../../../shared/types/OrderCasingDetails";
import { RingLoader } from "react-spinners";

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

  handleApprove: () => void;
  handleReject: () => void;
  handleHold: () => void;

  resetModal: () => void;
  casingDetails: OrderCasingDetails | null;
  loading: boolean;
}

const PreBuffingApprovalModal = ({
  setChecklistSaved,
  approvalModalRef,

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
  casingDetails,
  loading,
}: Props) => {
  console.log("showChecklist", casingDetails);

  return (
    <>
      <div
        className="modal fade"
        ref={approvalModalRef}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div
            className={`modal-content prebuffer-modal ${
              showChecklist ? "blur-approval-modal" : ""
            }`}
          >
            {/* HEADER */}

            <div className="modal-header">
              <h5 className="modal-title">PRE BUFFING - APPROVAL</h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                onClick={() => {
                  resetModal();
                }}
              />
            </div>

            {/* BODY */}

            <div className="modal-body">
              {/* TOP INFO */}

              <div className="modal-info me-1 mb-1 ms-1 prebuffer-top row text-nowrap">
                <div className="col">
                  <strong>Production No</strong>
                  <div>{casingDetails?.productionNumber}</div>
                </div>

                <div className="col">
                  <strong>Tyre Ref No</strong>
                  <div>{casingDetails?.tyreReferenceNumber}</div>
                </div>

                <div className="col">
                  <strong>Customer Name</strong>
                  <div>{casingDetails?.customerName}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{casingDetails?.tyreSize.casingSize}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>{casingDetails?.retreadDetail.patternName}</div>
                </div>
              </div>

              <div className="container p-1">
                <div className="row g-1">
                  {/* LEFT PANEL */}
                  <div className="col-md-6 ">
                    <div className="panel-box">
                      <div className="panel-header small fw-bold">
                        MATERIAL AVAILABILITY
                      </div>

                      <div className="panel-body p-1">
                        <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
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
                    <div className="panel-box ">
                      <div className="panel-body mb-3">
                        <div className="record-box text-start">
                          <div className="record-header small fw-bold">
                            Record [1 of 1]
                          </div>

                          <div className="row gx-2 gy-1 small">
                            <div className="col-4 record-item">
                              <b>Tyre Size:</b>{" "}
                              {casingDetails?.tyreSize.casingSize}
                            </div>
                            <div className="col-4 record-item">
                              <b>Make:</b> {casingDetails?.tyreMake.name}
                            </div>

                            <div className="col-4 record-item">
                              <b>Model:</b> {casingDetails?.model}
                            </div>
                            <div className="col-4 record-item">
                              <b>Brand:</b> {casingDetails?.retreadDetail.brand}
                            </div>

                            <div className="col-4 record-item">
                              <b>Pattern:</b>{" "}
                              {casingDetails?.retreadDetail.patternName}
                            </div>
                            <div className="col-4 record-item">
                              <b>Width:</b>{" "}
                              {casingDetails?.retreadDetail?.width}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* NEW SUGGESTED PATTERN */}
                <div className="panel-box mt-1 p-1">
                  <div className="row g-1 align-items-end">
                    <div className="row g-1 ">
                      <div className="suggest text-danger text-start">
                        <i className="bi bi-plus-square"></i> Suggest NEW
                        pattern
                      </div>
                      <div className="col">
                        <label className="form-label">Holding Reason</label>

                        <select
                          className="form-select"
                          value={holdReason}
                          onChange={(e) => setHoldReason(e.target.value)}
                        >
                          <option value="" disabled>
                            Select Hold Reason
                          </option>

                          {holdReasons.map((item) => (
                            <option
                              key={item.rejectionReasonId}
                              value={item.rejectionReasonId}
                            >
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
                          <option value="" disabled>
                            Select Pattern
                          </option>

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
                              (p) =>
                                String(p.treadPatternId) === selectedPatternId,
                            );

                            const variant = pattern?.variants?.find(
                              (v) => v.treadPatternVariantId === variantId,
                            );

                            if (variant) {
                              setSelectedWidth(variant.width);
                            }
                          }}
                        >
                          <option value="" disabled>
                            Select Width
                          </option>

                          {patterns
                            .find(
                              (p) =>
                                String(p.treadPatternId) === selectedPatternId,
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
                          placeholder="auto-filled"
                          value={selectedBrand}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Rejection Reason */}

              <div className=" row g-1 p-1 ">
                <label className="form-label m-0">Rejection Reason</label>

                <select
                  className="form-select"
                  style={{ minHeight: "20px" }}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select Rejection Reason</option>

                  {rejectionReasons.map((item) => (
                    <option key={item.rejectionReasonId} value={item.rejectionReasonId}>
                      {item.reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACTION BUTTONS */}

              <div className="row g-2 p-1">
                <div className="col-md-3">
                  <button
                    style={{ height: "100%" }}
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
                    style={{ height: "100%" }}
                    className="btn btn-reject w-100"
                    disabled={loading}
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
                    {loading ? "Processing..." : "REJECTED"}
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    style={{ height: "100%" }}
                    disabled={loading}
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
                    {loading ? "Processing..." : "HOLD"}
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    style={{ height: "100%" }}
                    className="btn btn-approve w-100"
                    disabled={loading}
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
                    {loading ? "Processing..." : "APPROVED"}
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

      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.6)",
            zIndex: 99999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RingLoader size={80} color="#b30815" />
        </div>
      )}
    </>
  );
};

export default PreBuffingApprovalModal;
