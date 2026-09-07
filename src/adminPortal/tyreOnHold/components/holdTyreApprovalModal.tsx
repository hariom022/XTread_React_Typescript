type Props = {
  selectedItem: any;
  onClose: () => void;
};

const HoldTyreApprovalModal = ({
  selectedItem,
  onClose,
}: Props) => {
  if (!selectedItem) return null;

  return (
    <>
      {/* BACKDROP */}
      <div className="modal-backdrop fade show"></div>

      {/* MODAL */}
      <div
        className="modal d-block"
        tabIndex={-1}
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">

          <div className="modal-content">

            {/* HEADER */}
            <div
              className="modal-header"
              style={{
                backgroundColor: "#b30815",
                color: "white",
              }}
            >
              <h5 className="modal-title">
                TYRE ON HOLD – APPROVAL
              </h5>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">

              {/* BASIC INFORMATION */}
              <div className="row g-3 mb-4">

                <div className="col-md-4">
                  <label className="fw-semibold">
                    Production No
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.casing || "-"}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="fw-semibold">
                    Tyre Ref No
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.serial || "-"}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="fw-semibold">
                    Customer Name
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.customerName || "-"}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="fw-semibold">
                    Tyre Size
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.tyreSize || "-"}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="fw-semibold">
                    Tyre Make
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.tyreMakeName || "-"}
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="fw-semibold">
                    Requested Pattern
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.requestedPattern || "-"}
                  </div>
                </div>

              </div>

              {/* HOLD INFORMATION */}
              <div className="card mb-4">

                <div className="card-header fw-bold">
                  HOLD INFORMATION
                </div>

                <div className="card-body">

                  <div className="row">

                    <div className="col-md-6">
                      <label className="fw-semibold">
                        Hold Reason
                      </label>

                      <div className="form-control bg-light">
                        Awaiting Customer LPO
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="fw-semibold">
                        Customer Approval Status
                      </label>

                      <div>
                        <span className="badge bg-warning text-dark fs-6">
                          PENDING
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="row g-3">

                <div className="col-md-6">
                  <button
                    className="btn btn-danger w-100"
                    style={{ height: "65px" }}
                    onClick={() => {
                      console.log(
                        "Reject clicked",
                        selectedItem
                      );
                    }}
                  >
                    <b>REJECT</b>
                  </button>
                </div>

                <div className="col-md-6">
                  <button
                    className="btn btn-success w-100"
                    style={{ height: "65px" }}
                    onClick={() => {
                      console.log(
                        "Approve clicked",
                        selectedItem
                      );
                    }}
                  >
                    <b>APPROVE</b>
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

export default HoldTyreApprovalModal;