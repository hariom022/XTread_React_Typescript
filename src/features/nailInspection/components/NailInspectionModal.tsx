import { MdOutlineMargin } from "react-icons/md";
import RepairSection from "./RepairSection";
import RepairTable from "./RepairTable";

type Props = {
  selectedItem: any;
  onClose: () => void;

  patchesRemoved: number;
  setPatchesRemoved: (value: number) => void;

  puncturesFound: number;
  setPuncturesFound: (value: number) => void;

  newRepair: any;
  setNewRepair: any;

  repairs: any[];
  setRepairs: any;

  addRepair: () => void;

  rejectionReason: string;
  setRejectionReason: (value: string) => void;

  rejectionReasons: any[];

  openChecklist: () => void;

  handleApprove: () => void;
  handleReject: () => void;
  handleHold: () => void;
  handleApproveWithPressureTest: () => void;
};

const NailInspectionModal = ({
  selectedItem,

  onClose,

  patchesRemoved,
  setPatchesRemoved,

  puncturesFound,
  setPuncturesFound,

  newRepair,
  setNewRepair,

  repairs,
  setRepairs,

  addRepair,

  rejectionReason,
  setRejectionReason,

  rejectionReasons,

  openChecklist,

  handleApprove,
  handleReject,
  handleHold,
  handleApproveWithPressureTest,
}: Props) => {
  if (!selectedItem) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal d-block" tabIndex={-1} style={{ zIndex: 1055 }}>
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content nail-modal">
            {/* HEADER */}
            <div className="modal-header nail-header">
              <h5 className="modal-title">NAIL INSPECTION – APPROVAL</h5>
              {/* STAFF NAME */}
              <div className="me-3 text-white text-end"
              style={{ marginLeft: "46rem !important"}}>
                {/* <strong className="fw-semibold d-block">Staff Name</strong> */}
                <b>John</b>
              </div>
              {/* CLOSE (X) BUTTON */}
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* TOP INFO */}
              <div className="modal-info m-0 p-1 building-top row text-nowrap">
                <div className="col">
                  <strong>Production No</strong>
                  <div>{selectedItem.casing}</div>
                </div>

                <div className="col">
                  <strong>Tyre Ref No</strong>
                  <div>{selectedItem.serial}</div>
                </div>

                <div className="col">
                  <strong>Customer Name</strong>
                  <div>{selectedItem.customerName || "-"}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{selectedItem.tyreSize || "-"}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>{selectedItem.pattern || "-"}</div>
                </div>
              </div>

              <div className="row mt-2">
                {/* LEFT SIDE */}
                <div className="col-md-8 border-end">
                  {/* PATCHES & PUNCTURES */}
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label>Patches Removed</label>

                      <select
                        className="form-select"
                        value={patchesRemoved}
                        onChange={(e) =>
                          setPatchesRemoved(Number(e.target.value))
                        }
                      >
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label>Punctures Found</label>

                      <select
                        className="form-select"
                        value={puncturesFound}
                        onChange={(e) =>
                          setPuncturesFound(Number(e.target.value))
                        }
                      >
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* REPAIR SECTION */}
                  <RepairSection
                    newRepair={newRepair}
                    setNewRepair={setNewRepair}
                    addRepair={addRepair}
                  />

                  {/* REPAIR TABLE */}
                  <RepairTable repairs={repairs} setRepairs={setRepairs} />

                  {/* BUTTONS */}
                  <div className="row g-2 mt-2">
                    <div className="col-6">
                      <button
                        className="btn btn-success w-100 btn-lg-actiond-flex align-items-center justify-content-center"
                        style={{ height: "70px" }}
                        onClick={handleApproveWithPressureTest}
                      >
                        <b>Approved With Pressure Test</b>
                      </button>
                    </div>

                    <div className="col-6">
                      <button
                        className="open-checklist-btn w-100 btn-lg-actiond-flex align-items-center justify-content-center"
                        style={{ height: "70px" }}
                        onClick={openChecklist}
                      >
                        <b>Puncture Detection Checklist</b>
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="col-md-4">
                  <div className="mb-6"
                  style={{marginBottom:"2.5rem"}}>
                    <label className="fw-semibold">Rejection Reason</label>

                    <select
                      className="form-select mt-1"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    >
                      <option value="">--- Select Reason ---</option>

                      {rejectionReasons.map((reason: any) => (
                        <option key={reason.code} value={reason.code}>
                          {reason.reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-grid gap-3">
                    <br />
                    <button
                      className="btn btn-reject btn-sm-action d-flex align-items-center justify-content-center gap-2"
                      style={{ height: "70px" }}
                      onClick={handleReject}
                    >
                      <b>REJECTED</b>
                      <span className="icon-box">
                        <i className="bi bi-x-lg"></i>
                      </span>
                    </button>

                    <button
                      className="btn btn-approve btn-sm-action d-flex align-items-center justify-content-center gap-3"
                      style={{ height: "70px" }}
                      onClick={() => {
                        handleApprove();
                      }}
                    >
                      <b>
                        APPROVED
                        <span style={{ width: "8px" }}>
                          {" "}
                          without Pressure Test
                        </span>
                      </b>
                      <span className="icon-box">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* HOLD */}
              <div className="row mt-3">
                <div className="col">
                  <button
                    className="btn btn-warning w-100 fw-bold"
                    onClick={handleHold}
                  >
                    HOLD – Awaiting Customer LPO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NailInspectionModal;
