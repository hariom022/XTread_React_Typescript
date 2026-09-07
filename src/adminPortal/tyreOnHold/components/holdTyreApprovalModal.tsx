import { useState } from "react";

type Props = {
  selectedItem: any;
  onClose: () => void;
};

const HoldTyreApprovalModal = ({
  selectedItem,
  onClose,
}: Props) => {
  // =========================================================
  // HOLD TYPE
  // =========================================================
  const [holdType, setHoldType] =
    useState("");

  // =========================================================
  // LPO FIELDS
  // =========================================================
  const [lpoNumber, setLpoNumber] =
    useState("");

  const [lpoDate, setLpoDate] =
    useState("");

  // =========================================================
  // PAYMENT FIELDS
  // =========================================================
  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentDate, setPaymentDate] =
    useState("");

  // =========================================================
  // CLOSE / RESET
  // =========================================================
  const handleClose = () => {
    setHoldType("");
    setLpoNumber("");
    setLpoDate("");
    setPaymentAmount("");
    setPaymentDate("");

    onClose();
  };

  // =========================================================
  // APPROVE
  // =========================================================
  const handleApprove = () => {
    console.log("Approve clicked");

    console.log({
      selectedItem,
      holdType,
      lpoNumber,
      lpoDate,
      paymentAmount,
      paymentDate,
    });
  };

  // =========================================================
  // REJECT
  // =========================================================
  const handleReject = () => {
    console.log("Reject clicked");

    console.log({
      selectedItem,
      holdType,
      lpoNumber,
      lpoDate,
      paymentAmount,
      paymentDate,
    });
  };

  if (!selectedItem) return null;

  return (
    <>
      {/* =====================================================
          BACKDROP
      ====================================================== */}
      <div className="modal-backdrop fade show"></div>

      {/* =====================================================
          MODAL
      ====================================================== */}
      <div
        className="modal d-block"
        tabIndex={-1}
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">

          <div className="modal-content">

            {/* =================================================
                HEADER
            ================================================== */}
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
                onClick={handleClose}
              />
            </div>

            {/* =================================================
                BODY
            ================================================== */}
            <div className="modal-body">

              {/* =================================================
                  BASIC INFORMATION
              ================================================== */}
              <div className="row g-3 mb-4">

                {/* Production No */}
                <div className="col-md-4">
                  <label className="fw-semibold">
                    Production No
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.casing || "-"}
                  </div>
                </div>

                {/* Tyre Ref No */}
                <div className="col-md-4">
                  <label className="fw-semibold">
                    Tyre Ref No
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.serial || "-"}
                  </div>
                </div>

                {/* Customer Name */}
                <div className="col-md-4">
                  <label className="fw-semibold">
                    Customer Name
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.customerName || "-"}
                  </div>
                </div>

                {/* Tyre Size */}
                <div className="col-md-4">
                  <label className="fw-semibold">
                    Tyre Size
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.tyreSize || "-"}
                  </div>
                </div>

                {/* Tyre Make */}
                <div className="col-md-4">
                  <label className="fw-semibold">
                    Tyre Make
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.tyreMakeName || "-"}
                  </div>
                </div>

                {/* Requested Pattern */}
                <div className="col-md-4">
                  <label className="fw-semibold">
                    Requested Pattern
                  </label>

                  <div className="form-control bg-light">
                    {selectedItem.requestedPattern || "-"}
                  </div>
                </div>

              </div>

              {/* =================================================
                  HOLD INFORMATION
              ================================================== */}
              <div className="card mb-4">

                <div className="card-header fw-bold">
                  HOLD INFORMATION
                </div>

                <div className="card-body">

                  <div className="row g-3">

                    {/* =================================================
                        HOLD REASON DROPDOWN
                    ================================================== */}
                    <div className="col-md-6">

                      <label className="fw-semibold">
                        Hold Reason
                      </label>

                      <select
                        className="form-select"
                        value={holdType}
                        onChange={(e) =>
                          setHoldType(
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select Hold Reason
                        </option>

                        <option value="lpo">
                          Awaiting Customer LPO
                        </option>

                        <option value="payment">
                          Payment
                        </option>
                      </select>

                    </div>

                    {/* =================================================
                        CUSTOMER APPROVAL STATUS
                    ================================================== */}
                    <div className="col-md-6">

                      <label className="fw-semibold">
                        Customer Approval Status
                      </label>

                      <div className="mt-1">
                        <span className="badge bg-warning text-dark fs-6">
                          PENDING
                        </span>
                      </div>

                    </div>

                    {/* =================================================
                        LPO FIELDS
                    ================================================== */}
                    {holdType === "lpo" && (
                      <>
                        {/* LPO Number */}
                        <div className="col-md-6">

                          <label className="fw-semibold">
                            LPO Number
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter LPO Number"
                            value={lpoNumber}
                            onChange={(e) =>
                              setLpoNumber(
                                e.target.value
                              )
                            }
                          />

                        </div>

                        {/* LPO Date */}
                        <div className="col-md-6">

                          <label className="fw-semibold">
                            Date
                          </label>

                          <input
                            type="date"
                            className="form-control"
                            value={lpoDate}
                            onChange={(e) =>
                              setLpoDate(
                                e.target.value
                              )
                            }
                          />

                        </div>
                      </>
                    )}

                    {/* =================================================
                        PAYMENT FIELDS
                    ================================================== */}
                    {holdType === "payment" && (
                      <>
                        {/* Amount */}
                        <div className="col-md-6">

                          <label className="fw-semibold">
                            Amount
                          </label>

                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Amount"
                            value={paymentAmount}
                            onChange={(e) =>
                              setPaymentAmount(
                                e.target.value
                              )
                            }
                          />

                        </div>

                        {/* Payment Date */}
                        <div className="col-md-6">

                          <label className="fw-semibold">
                            Date
                          </label>

                          <input
                            type="date"
                            className="form-control"
                            value={paymentDate}
                            onChange={(e) =>
                              setPaymentDate(
                                e.target.value
                              )
                            }
                          />

                        </div>
                      </>
                    )}

                  </div>

                </div>
              </div>

              {/* =================================================
                  ACTION BUTTONS
              ================================================== */}
              <div className="row g-3">

                {/* REJECT */}
                <div className="col-md-6">

                  <button
                    type="button"
                    className="btn btn-danger w-100"
                    style={{
                      height: "65px",
                    }}
                    onClick={handleReject}
                  >
                    <b>REJECT</b>
                  </button>

                </div>

                {/* APPROVE */}
                <div className="col-md-6">

                  <button
                    type="button"
                    className="btn btn-success w-100"
                    style={{
                      height: "65px",
                    }}
                    onClick={handleApprove}
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