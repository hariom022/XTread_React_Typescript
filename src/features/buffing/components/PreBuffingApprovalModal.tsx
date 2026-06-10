import { useEffect } from "react";
import { createPortal } from "react-dom";
import { PRE_BUFFING_CHECKLIST } from "../constants/preBuffingCheckList";

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
  tyreMake: string;
  model: string;
  brand: string;
  width: string;
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
  setSelectedPatternId: React.Dispatch<
    React.SetStateAction<string>
  >;

  selectedVariantId: number | "";
  setSelectedVariantId: React.Dispatch<
    React.SetStateAction<number | "">
  >;

  selectedBrand: string;
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<string>
  >;

  setSelectedWidth: React.Dispatch<
    React.SetStateAction<string>
  >;

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
}: Props) => {
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
              <h5 className="modal-title mb-0">
                PRE BUFFING - APPROVAL
              </h5>

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

              <div className="row g-3 align-items-end mt-2">

                <div className="col">
                  <label className="form-label">
                    Holding Reason
                  </label>

                  <select
                    className="form-select"
                    value={holdReason}
                    onChange={(e) =>
                      setHoldReason(e.target.value)
                    }
                  >
                    <option value="">
                      Select Hold Reason
                    </option>

                    {holdReasons.map((item) => (
                      <option
                        key={item.rejectionReasonId}
                        value={item.code}
                      >
                        {item.reason}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pattern */}

                <div className="col">
                  <label className="form-label">
                    Pattern
                  </label>

                  <select
                    className="form-select"
                    value={selectedPatternId}
                    onChange={(e) => {
                      const patternId =
                        e.target.value;

                      setSelectedPatternId(
                        patternId
                      );

                      const pattern =
                        patterns.find(
                          (x) =>
                            String(
                              x.treadPatternId
                            ) ===
                            patternId
                        );

                      if (pattern) {
                        setSelectedBrand(
                          pattern.brand
                        );

                        setSelectedVariantId(
                          ""
                        );

                        setSelectedWidth(
                          ""
                        );
                      }
                    }}
                  >
                    <option value="">
                      Select Pattern
                    </option>

                    {patterns.map((item) => (
                      <option
                        key={
                          item.treadPatternId
                        }
                        value={
                          item.treadPatternId
                        }
                      >
                        {item.patternName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Width */}

                <div className="col">
                  <label className="form-label">
                    Width
                  </label>

                  <select
                    className="form-select"
                    value={selectedVariantId}
                    onChange={(e) =>
                      setSelectedVariantId(
                        Number(
                          e.target.value
                        )
                      )
                    }
                  >
                    <option value="">
                      Select Width
                    </option>

                    {patterns
                      .find(
                        (p) =>
                          String(
                            p.treadPatternId
                          ) ===
                          selectedPatternId
                      )
                      ?.variants?.map(
                        (variant) => (
                          <option
                            key={
                              variant.treadPatternVariantId
                            }
                            value={
                              variant.treadPatternVariantId
                            }
                          >
                            {variant.width}
                          </option>
                        )
                      )}
                  </select>
                </div>

                {/* Brand */}

                <div className="col">
                  <label className="form-label">
                    Brand
                  </label>

                  <input
                    className="form-control"
                    value={selectedBrand}
                    readOnly
                  />
                </div>

              </div>

              {/* Rejection Reason */}

              <div className="mt-3">
                <label className="form-label">
                  Rejection Reason
                </label>

                <select
                  className="form-select"
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Rejection Reason
                  </option>

                  {rejectionReasons.map(
                    (item) => (
                      <option
                        key={
                          item.rejectionReasonId
                        }
                        value={item.code}
                      >
                        {item.reason}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ACTION BUTTONS */}

              <div className="row g-2 mt-3">

                <div className="col-md-3">
                  <button
                    className="btn btn-outline-primary w-100"
                    // onClick={() =>
                    //   setShowChecklist(
                    //     true
                    //   )
                    // }
                  >
                    Pre-Buffing Checklist
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-reject w-100"
                    onClick={
                      handleReject
                    }
                  >
                    REJECTED
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-warning w-100"
                    onClick={
                      handleHold
                    }
                  >
                    HOLD
                  </button>
                </div>

                <div className="col-md-3">
                  <button
                    className="btn btn-approve w-100"
                    onClick={
                      handleApprove
                    }
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

      {/* {showChecklist &&
        createPortal(
          <div
            className="modal d-block"
            tabIndex={-1}
          >
            <div className="modal-dialog modal-md modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header nail-header">
                  <h5 className="modal-title">
                    Pre Buffing Checklist
                  </h5>

                  <button
                    className="btn-close btn-close-white"
                    onClick={() =>
                      setShowChecklist(
                        false
                      )
                    }
                  />
                </div>

                <div className="modal-body">

                  <table className="table table-bordered">

                    <tbody>

                      <tr>
                        <td>

                          <input
                            type="checkbox"
                            checked={
                              selectAllChecklist
                            }
                            onChange={
                              handleSelectAllChecklist
                            }
                          />

                          Select All

                        </td>
                      </tr>

                      {PRE_BUFFING_CHECKLIST.map(
                        (item) => (
                          <tr
                            key={item.id}
                          >
                            <td>

                              <input
                                type="checkbox"
                                checked={checkedChecklist.includes(
                                  item.id
                                )}
                                onChange={() =>
                                  toggleChecklist(
                                    item.id
                                  )
                                }
                              />

                              {item.label}

                            </td>
                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => {
                      setChecklistSaved(
                        true
                      );

                      setShowChecklist(
                        false
                      );
                    }}
                  >
                    Save Checklist
                  </button>
                </div>

              </div>
            </div>
          </div>,
          document.body
        )} */}
    </>
  );
};

export default PreBuffingApprovalModal;