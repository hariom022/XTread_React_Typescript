import type { RefObject } from "react";

import "../style/skivingStage.css";

interface Props {
  modalRef: RefObject<HTMLDivElement | null>;

  selectedItem: any;

  repeatSkiving: boolean;
  setRepeatSkiving: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  skipRepair: boolean;
  setSkipRepair: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  rejectionReason: string;
  setRejectionReason: React.Dispatch<
    React.SetStateAction<string>
  >;

  rejectionReasons: any[];

  handleApprove: () => void;

  handleReject: () => void;

  resetModal: () => void;
}

const SkivingApprovalModal = ({
  modalRef,

  selectedItem,

  repeatSkiving,
  setRepeatSkiving,

  skipRepair,
  setSkipRepair,

  rejectionReason,
  setRejectionReason,

  rejectionReasons,

  handleApprove,
  handleReject,

  resetModal,
}: Props) => {
  const hasRepairs =
    selectedItem?.repairOperations
      ?.length > 0;

  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header skiving-header d-flex align-items-center">

            <h5 className="modal-title flex-grow-1 text-white">
              SKIVING APPROVAL
            </h5>

            <div className="me-3 text-white text-end">
              <div>John</div>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              onClick={resetModal}
            />
          </div>

          <div className="modal-body">
            <div className="mb-2">

              <div className="modal-info m-0 p-1 mb-1 postbuff-top row text-nowrap">

                <div className="col">
                  <strong>Production No</strong>
                  <div>{selectedItem?.casing}</div>
                </div>

                <div className="col">
                  <strong>Tyre Ref No</strong>
                  <div>{selectedItem?.serial}</div>
                </div>

                <div className="col">
                  <strong>Customer Name</strong>
                  <div>{selectedItem?.customerName}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{selectedItem?.tyreSize}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>
                    {selectedItem?.requestedPattern}
                  </div>
                </div>

                <div className="col">
                  <strong>ReApproved Pattern</strong>
                  <div>
                    {selectedItem?.reApprovedPattern}
                  </div>
                </div>

              </div>

            </div>

            <div className="row mt-1">

              {/* LEFT PANEL */}

              <div className="col-md-8">

                <div className="panel-box-left p-2">

                  <div className="col-md-8 mb-2 d-flex align-items-center">

                    <b className="me-2">
                      Damage Level:
                    </b>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      style={{
                        width: "120px",
                      }}
                      value={
                        selectedItem?.damageLevel ||
                        ""
                      }
                      readOnly
                    />

                  </div>

                  <div className="table-responsive mb-2">

                    <table className="table table-bordered align-middle">

                      <thead className="table-light">
                        <tr>
                          <th>Type</th>
                          <th>Location</th>
                        </tr>
                      </thead>

                      <tbody>

                        {!selectedItem?.repairOperations
                          ?.length ? (
                          <tr>
                            <td
                              colSpan={2}
                              className="text-center text-muted"
                            >
                              No skiving data available
                            </td>
                          </tr>
                        ) : (
                          selectedItem.repairOperations.map(
                            (
                              row: any,
                              index: number,
                            ) => (
                              <tr key={index}>
                                <td>
                                  {row.repairType}
                                </td>

                                <td>
                                  {
                                    row.repairLocation
                                  }
                                </td>
                              </tr>
                            ),
                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                  <div className="d-flex align-items-center justify-content-center">

                    <div className="form-check mb-2 me-4">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={skipRepair}
                        disabled={hasRepairs}
                        onChange={(e) =>
                          setSkipRepair(
                            e.target.checked,
                          )
                        }
                      />

                      <label
                        className={`form-check-label fw-semibold ${hasRepairs
                          ? "text-muted"
                          : ""
                          }`}
                      >
                        Skip Repair
                      </label>

                    </div>

                    <div className="col-md-4">

                      <button
                        className="btn btn-approve w-100 d-flex align-items-center justify-content-center"
                        onClick={handleApprove}
                      >
                        <span>APPROVED</span>

                        <span className="icon-box ms-2">
                          <i className="bi bi-check-lg"></i>
                        </span>
                      </button>

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT PANEL */}

              <div className="col-md-4">

                <div className="panel-box-right p-2">

                  <p className="fw-semibold text-center mb-3">

                    Require skiving to be repeated
                    on the casing

                  </p>

                  <div className="text-center">

                    <button
                      className={`btn ${repeatSkiving
                        ? "btn-danger"
                        : "btn-warning"
                        }`}
                      onClick={() =>
                        setRepeatSkiving(
                          !repeatSkiving,
                        )
                      }
                    >
                      Repeat Skiving
                    </button>

                  </div>

                  <div className="mb-3 mt-3">

                    <label className="fw-semibold">
                      Rejection Reason
                    </label>

                    <select
                      className="form-select"
                      value={
                        rejectionReason
                      }
                      onChange={(e) =>
                        setRejectionReason(
                          e.target.value,
                        )
                      }
                    >

                      <option value="">
                        --- Select Reason ---
                      </option>

                      {rejectionReasons.map(
                        (item) => (
                          <option
                            key={
                              item.rejectionReasonId
                            }
                            value={
                              item.code
                            }
                          >
                            {item.reason}
                          </option>
                        ),
                      )}

                    </select>

                  </div>

                  <button
                    className="btn btn-reject w-100 d-flex align-items-center justify-content-center"
                    onClick={handleReject}
                  >
                    <span>REJECTED</span>

                    <span className="icon-box ms-2">
                      <i className="bi bi-x-lg"></i>
                    </span>
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SkivingApprovalModal;