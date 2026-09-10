import { useState } from "react";
import holdTyreServiceApi from "../service/holdTyreServiceApi";

type Props = {
  selectedItem: any;
  onClose: () => void;
  activeTab: "nail" | "shearography" ; //| "buffing";
  onApproved: () => Promise<void>;
};

const HoldTyreApprovalModal = ({
  selectedItem,
  activeTab,
  onClose,
  onApproved,
}: Props) => {
  // =========================================================
  // HOLD TYPE
  // =========================================================
  // const [holdType, setHoldType] =  useState("");

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

  // ==============HOLD TYPE===============
  const holdType =
    selectedItem?.holdType === 1
      ? "lpo"
      : selectedItem?.holdType === 2
        ? "payment"
        : "";

  const holdTypeLabel =
    selectedItem?.holdType === 1
      ? "Customer LPO"
      : selectedItem?.holdType === 2
        ? "Payment"
        : "-";

  // =========================================================
  // CLOSE / RESET
  // =========================================================
  const handleClose = () => {
    // setHoldType("");
    setLpoNumber("");
    setLpoDate("");
    setPaymentAmount("");
    setPaymentDate("");

    onClose();
  };

  // =========================================================
  // APPROVE
  // =========================================================
  const handleApprove = async () => {
    try {
      // =====================================================
      // APPROVE API ONLY FOR NAIL & SHEAROGRAPHY
      // =====================================================
      if (
        activeTab !== "nail" &&
        activeTab !== "shearography"
      ) {
        return;
      }

      // =====================================================
      // HOLD ID
      // =====================================================
      const holdId = selectedItem?.holdId;

      if (!holdId) {
        console.error(
          "Hold ID is missing:",
          selectedItem
        );
        return;
      }

      // =====================================================
      // VALIDATION
      // =====================================================
      if (!holdType) {
        alert("Please select Hold Reason.");
        return;
      }

      if (holdType === "lpo") {
        if (!lpoNumber.trim()) {
          alert("Please enter LPO Number.");
          return;
        }

        if (!lpoDate) {
          alert("Please select LPO Date.");
          return;
        }
      }

      if (holdType === "payment") {
        if (!paymentAmount) {
          alert("Please enter Payment Amount.");
          return;
        }

        if (!paymentDate) {
          alert("Please select Payment Date.");
          return;
        }
      }

      // =====================================================
      // DATE
      // API EXPECTS ISO DATETIME
      // =====================================================
      const selectedDate =
        holdType === "lpo"
          ? lpoDate
          : paymentDate;

      const isoDate = new Date(
        `${selectedDate}T00:00:00`
      ).toISOString();

      // =====================================================
      // AMOUNT
      // API EXPECTS NUMBER
      // =====================================================
      const amount =
        holdType === "payment"
          ? Number(paymentAmount)
          : 0;

      // =====================================================
      // REQUEST BODY
      // =====================================================
      const payload = {
        lpoNumber:
          holdType === "lpo"
            ? lpoNumber.trim()
            : "",

        date: isoDate,

        amount,

        remarks:
          holdType === "payment"
            ? "payment received"
            : "LPO received",
      };

      console.log(
        "===================================="
      );

      console.log(
        "APPROVE HOLD REQUEST"
      );

      console.log(
        "Hold ID:",
        holdId
      );

      console.log(
        "Active Tab:",
        activeTab
      );

      console.log(
        "Payload:",
        payload
      );

      console.log(
        "===================================="
      );

      // =====================================================
      // CALL API
      // =====================================================
      const response =
        await holdTyreServiceApi.approveHold(
          holdId,
          payload
        );

      console.log(
        "APPROVE HOLD RESPONSE:",
        response
      );

      // =====================================================
      // CHECK SUCCESS
      // =====================================================
      if (response?.data?.success === true) {

        console.log(
          "Hold approved successfully."
        );
        // Refresh index page
        await onApproved();
        // Reset modal state
        // setHoldType("");
        setLpoNumber("");
        setLpoDate("");
        setPaymentAmount("");
        setPaymentDate("");

        // Close modal
        onClose();
      } else {

        console.error(
          "Approve API returned unsuccessful response:",
          response?.data
        );

        alert(
          response?.data?.error ||
          "Failed to approve hold."
        );
      }

    } catch (error: any) {

      console.error(
        "APPROVE HOLD API ERROR:",
        error
      );

      console.error(
        "API ERROR RESPONSE:",
        error?.response?.data
      );

      console.error(
        "API ERROR STATUS:",
        error?.response?.status
      );

      alert(
        error?.response?.data?.error ||
        "Failed to approve hold."
      );
    }
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
                backgroundColor: "#ff3040 !important",
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
              {/* <div className="modal-body"> */}
              <div>
                {/* TOP INFO */}
                <div className="modal-info m-0 row text-nowrap">
                  <div className="col">
                    <strong>Production No</strong>
                    <div>{selectedItem?.casing || "-"}</div>
                  </div>

                  <div className="col">
                    <strong>Tyre Ref No</strong>
                    <div>{selectedItem?.serial || "-"}</div>
                  </div>

                  <div className="col">
                    <strong>Customer Name</strong>
                    <div>{selectedItem?.customerName || "-"}</div>
                  </div>

                  <div className="col">
                    <strong>Tyre Size</strong>
                    <div>{selectedItem?.tyreSize || "-"}</div>
                  </div>

                  <div className="col">
                    <strong>Requested Pattern</strong>
                    <div>{selectedItem?.requestedPattern || "-"}</div>
                  </div>
                </div>
                {/* </div> */}

                {/* =================================================
                  HOLD INFORMATION
              ================================================== */}
                <div className="card mb-3 mt-2">

                  <div className="card-header fw-bold">
                    HOLD INFORMATION
                  </div>

                  <div className="card-body">

                    <div className="row g-3">
                      {/* ================== HOLD TYPE======================== */}
                      <div className="col-md-6">
                        <label className="fw-semibold">
                          Hold Type
                        </label>

                        <div className="form-control bg-light">
                          {holdTypeLabel}
                        </div>
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
                        HOLD REASON DROPDOWN
                    ================================================== */}
                      {/* <div className="col-md-6">

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

                      </div> */}


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

                  {/* APPROVE */}
                  <div className="col-md-6">

                    <button
                      type="button"
                      className="btn btn-approve w-100 h-100"
                      style={{
                        // background: "linear-gradient(135deg, #28a745, #26a369)",
                        height: "100%",
                      }}
                      onClick={handleApprove}
                    >
                      <b>APPROVED</b>
                    </button>

                  </div>

                  {/* REJECT */}
                  <div className="col-md-6">

                    <button
                      type="button"
                      className="btn btn-reject w-100 h-100"
                      style={{
                        height: "100%",
                      }}
                      onClick={handleReject}
                    >
                      <b>REJECTED</b>
                    </button>

                  </div>

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