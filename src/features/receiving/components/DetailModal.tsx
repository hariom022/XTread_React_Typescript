import type { ReceivingRow } from "../types/receiving.types";

type Props = {
  show: boolean;
  data: ReceivingRow | null;
  onClose: () => void;
};

const DetailModal = ({
  show,
  data,
  onClose,
}: Props) => {
  if (!show || !data) return null;

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content shadow border-0 rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-danger text-white py-2 border-0">
            <div>
              <h5 className="modal-title fw-bold mb-0">
                Casing Details
              </h5>

              <small className="opacity-75">
                Detailed tyre casing information
              </small>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          {/* Body */}
          <div className="modal-body bg-light py-3">
            <div className="container-fluid">

              {/* Order Information */}
              <div className="mb-3">
                <h6 className="fw-bold text-primary border-bottom pb-1 mb-2">
                  Order Information
                </h6>

                <div className="row g-2">
                  {[
                    ["Order No", data.orderNo],
                    ["Date", data.date],
                    ["Category", data.categoryName],
                    ["Customer Name", data.customerName],
                  ].map(([label, value], index) => (
                    <div className="col-md-3" key={index}>
                      <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                        <small className="text-muted d-block">
                          {label}
                        </small>

                        <div className="fw-semibold small text-dark">
                          {value || "-"}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-md-3">
                    <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                      <small className="text-muted d-block">
                        Service Type
                      </small>

                      <span className="badge bg-success">
                        {data.serviceType || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tyre Information */}
              <div className="mb-3">
                <h6 className="fw-bold text-primary border-bottom pb-1 mb-2">
                  Tyre Information
                </h6>

                <div className="row g-2">
                  {[
                    ["Tyre Ref No", data.tyreReferenceNumber],
                    ["Other Number", data.otherNumber],
                    ["DOT No", data.dotNo],
                    ["Tyre Size", data.casingSize],
                    ["Make", data.make],
                    ["Model", data.model],
                    ["Existing Repairs", data.existingRepairsCount],
                    ["Tread Pattern", data.treadPattern],
                    ["Tread Width", data.treadWidth],
                  ].map(([label, value], index) => (
                    <div className="col-md-3" key={index}>
                      <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                        <small className="text-muted d-block">
                          {label}
                        </small>

                        <div className="fw-semibold small text-dark">
                          {value || "-"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retread Information */}
              {(data.serviceType === "Retread" ||
                data.serviceType === "Claim") && (
                <div className="mb-3">
                  <h6 className="fw-bold text-primary border-bottom pb-1 mb-2">
                    Retread Information
                  </h6>

                  <div className="row g-2">
                    <div className="col-md-3">
                      <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                        <small className="text-muted d-block">
                          No Of Retreads
                        </small>

                        <div className="fw-semibold small text-dark">
                          {data.numberOfRetreads || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                        <small className="text-muted d-block">
                          Previous Pattern
                        </small>

                        <div className="fw-semibold small text-dark">
                          {data.previousPattern || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                        <small className="text-muted d-block">
                          Previous Retreader
                        </small>

                        <div className="fw-semibold small text-dark">
                          {data.previousRetreaded || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                        <small className="text-muted d-block">
                          Tyre Classification
                        </small>

                        <div className="fw-semibold small text-dark">
                          {data.tyreClassification || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Repair Information */}
              {(data.serviceType === "Repair" ||
                data.serviceType === "Claim") && (
                <div className="mb-3">
                  <h6 className="fw-bold text-primary border-bottom pb-1 mb-2">
                    Repair Information
                  </h6>

                  <div className="row g-2">
                    {[
                      ["Damage Type", data.damageType],
                      ["Repair Location", data.repairLocation],
                      ["Repair Qty", data.repairQty],
                    ].map(([label, value], index) => (
                      <div className="col-md-4" key={index}>
                        <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                          <small className="text-muted d-block">
                            {label}
                          </small>

                          <div className="fw-semibold small text-dark">
                            {value || "-"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Information */}
              <div>
                <h6 className="fw-bold text-primary border-bottom pb-1 mb-2">
                  Additional Information
                </h6>

                <div className="row g-2">
                  <div className="col-md-4">
                    <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                      <small className="text-muted d-block">
                        Vehicle Reg No
                      </small>

                      <div className="fw-semibold small text-dark">
                        {data.customerVehicleRegNo || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                      <small className="text-muted d-block">
                        Remaining Tread Depth
                      </small>

                      <div className="fw-semibold small text-dark">
                        {data.remainingTreadDepth || "-"}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="p-2 rounded-3 border bg-white shadow-sm h-100">
                      <small className="text-muted d-block">
                        Comments
                      </small>

                      <div className="fw-semibold small text-dark">
                        {data.comments || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;