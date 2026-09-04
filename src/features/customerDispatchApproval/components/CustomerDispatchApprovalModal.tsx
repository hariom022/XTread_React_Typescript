import { useEffect, useRef, useState } from "react";
import { RingLoader } from "react-spinners";
import type {
  CustomerApprovalRequest,
  CustomerApprovalResponse,
  CustomerDispatchOrderGroup,
} from "../types/customerDispatchApproval.type";

interface Props {
  order: CustomerDispatchOrderGroup;

  onClose: () => void;

  approveCustomer: (
    request: CustomerApprovalRequest
  ) => Promise<CustomerApprovalResponse>;
}

const CustomerDispatchApprovalModal = ({
  order,
  onClose,
  approveCustomer,
}: Props) => {
  // ==========================================================
  // FORM STATES
  // ==========================================================

  const [customerRepresentative, setCustomerRepresentative] =
    useState<string>("");

  const [mobileNumber, setMobileNumber] =
    useState<string>("");

  const [emailAddress, setEmailAddress] =
    useState<string>("");

  const [condition, setCondition] =
    useState<string>(
      "Received in Good Condition"
    );

  const [remarks, setRemarks] =
    useState<string>("");

  const [signature, setSignature] =
    useState<string>("");

  const [approving, setApproving] =
    useState<boolean>(false);

  const [message, setMessage] =
    useState<string>("");


  // ==========================================================
  // SIGNATURE
  // ==========================================================

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] =
    useState<boolean>(false);

  const [hasSignature, setHasSignature] =
    useState<boolean>(false);


  // ==========================================================
  // CANVAS
  // ==========================================================

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#222222";
  }, []);


  // ==========================================================
  // GET SIGNATURE COORDINATES
  // ==========================================================

  const getCoordinates = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect =
      canvas.getBoundingClientRect();

    if ("touches" in event) {
      const touch =
        event.touches[0];

      return {
        x:
          touch.clientX -
          rect.left,

        y:
          touch.clientY -
          rect.top,
      };
    }

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    };
  };


  // ==========================================================
  // START DRAWING
  // ==========================================================

  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const {
      x,
      y,
    } = getCoordinates(event);

    context.beginPath();

    context.moveTo(x, y);

    setIsDrawing(true);
  };


  // ==========================================================
  // DRAW
  // ==========================================================

  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    if (!isDrawing) {
      return;
    }

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const {
      x,
      y,
    } = getCoordinates(event);

    context.lineTo(x, y);

    context.stroke();

    setHasSignature(true);
  };


  // ==========================================================
  // STOP DRAWING
  // ==========================================================

  const stopDrawing = () => {
    if (!isDrawing) {
      return;
    }

    setIsDrawing(false);

    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const image =
      canvas.toDataURL(
        "image/png"
      );

    setSignature(image);
  };


  // ==========================================================
  // CLEAR SIGNATURE
  // ==========================================================

  const clearSignature = () => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    setSignature("");

    setHasSignature(false);
  };


  // ==========================================================
  // APPROVE
  // ==========================================================

  const handleApprove = async () => {
    // Validate customer representative
    if (!customerRepresentative.trim()) {
      setMessage("Please enter customer representative name.");
      return;
    }

    // Validate mobile number
    if (!mobileNumber.trim()) {
      setMessage("Please enter mobile number.");
      return;
    }

    // Validate signature
    if (!hasSignature || !signature) {
      setMessage("Please provide customer signature.");
      return;
    }

    setApproving(true);
    setMessage("");

    try {
      const request: CustomerApprovalRequest = {
        deliverySheetNo: order.deliverySheetNo,
        casingIds: order.casings.map(
          (casing) => casing.orderCasingId
        ),
        customerRepresentative,
        mobileNumber,
        emailAddress,
        condition,
        remarks,
        signature,
      };

      console.log("Customer Approval Request:", request);

      const response = await approveCustomer(request);

      if (response.success) {
        setMessage(
          "Customer approval completed successfully."
        );

        console.log(
          "Customer approval successful:",
          response.data
        );
      } else {
        setMessage(
          response.error ||
          "Customer approval failed."
        );
      }
    } catch (error) {
      console.error(
        "Customer approval error:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to complete customer approval."
      );
    } finally {
      setApproving(false);
    }
  };

  // ==========================================================
  // MODAL
  // ==========================================================

  return (
    <>
      {approving && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 99999,
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      )}
      {/* BACKDROP */}
      <div className="modal-backdrop fade show" />

      {/* MODAL */}

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">

          <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">

            {/* =================================================
              HEADER
            ================================================== */}

            <div className="modal-header bg-danger text-white px-3 px-md-4 d-flex justify-content-between align-items-center">

              <div className="d-flex align-items-center gap-2">

                <div
                  className="d-flex align-items-center justify-content-center border border-2 border-white rounded-3 flex-shrink-0"
                  style={{
                    width: "38px",
                    height: "38px",
                  }}
                >
                  <i className="bi bi-shield-check fs-5" />
                </div>

                <div>

                  <h4 className="mb-0 fw-bold fs-5">
                    Customer Approval
                  </h4>

                  <div className="small opacity-75">
                    Verify and approve dispatched casings
                  </div>

                </div>

              </div>

              <button
                type="button"
                className="btn btn-light text-danger rounded-2"
                onClick={onClose}
                aria-label="Close"
              >
                <i className="bi bi-x-lg" />
              </button>

            </div>


            {/* =================================================
             BODY
             ================================================== */}

            <div className="modal-body p-2 p-md-3 bg-light">

              {/* =================================================
                  ORDER INFORMATION
              ================================================== */}
              <div className="card border-0 shadow-sm mb-3">

                <div className="card-body p-3">

                  <div className="d-flex align-items-center gap-2 mb-3">

                    <div
                      className="d-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-3 flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      <i className="bi bi-file-earmark-text" />
                    </div>

                    <h5 className="mb-0 fw-bold fs-6">
                      Order Information
                    </h5>

                  </div>

                  <div className="row g-2">

                    {/* Delivery Sheet */}

                    <div className="col-12 col-lg-4">

                      <div className="border rounded-3 p-2 h-100">

                        <small className="fw-semibold d-block text-secondary">
                          Delivery Sheet No
                        </small>

                        <strong className="text-danger">
                          {order.deliverySheetNo}
                        </strong>

                      </div>

                    </div>


                    {/* Customer */}

                    <div className="col-12 col-lg-5">

                      <div className="border rounded-3 p-2 h-100">

                        <small className="fw-semibold d-block text-secondary">
                          Customer Name
                        </small>

                        <strong>
                          {order.customerName}
                        </strong>

                      </div>

                    </div>


                    {/* Date / Total */}

                    <div className="col-12 col-lg-3">

                      <div className="border rounded-3 p-2 h-100">

                        <div className="row">

                          <div className="col-7">

                            <small className="fw-semibold d-block text-secondary">
                              Order Date
                            </small>

                            <strong className="d-flex align-items-center gap-1">
                              <i className="bi bi-calendar3" />
                              {order.orderDate}
                            </strong>

                          </div>


                          <div className="col-5 border-start">

                            <small className="fw-semibold d-block ms-2 text-secondary">
                              Total
                            </small>

                            <strong className="d-block ms-2">
                              {order.totalCasings}
                            </strong>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  DISPATCHED ITEMS
              ================================================== */}
              <div className="card border-0 shadow-sm mb-3">

                <div className="card-body p-3">

                  <div className="d-flex align-items-center gap-2 mb-3">

                    <div
                      className="d-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-3 flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      <i className="bi bi-truck" />
                    </div>

                    <div>
                      <h5 className="mb-0 fw-bold fs-6">
                        Dispatched Items
                      </h5>

                      <small className="text-secondary">
                        {order.totalCasings} casing(s) dispatched
                      </small>
                    </div>

                  </div>

                  <div className="table-responsive border rounded-3">

                    <table
                      className="table table-sm mb-0 align-middle"
                      style={{ minWidth: "950px" }}
                    >

                      <thead>

                        <tr className="bg-danger">

                          <th className="px-2 py-2 text-white text-nowrap">
                            Tyre Ref No
                          </th>

                          <th className="px-2 py-2 text-white">
                            Other No
                          </th>

                          <th className="px-2 py-2 text-white">
                            DOT No
                          </th>

                          <th className="px-2 py-2 text-white text-nowrap">
                            Tyre Size
                          </th>

                          <th className="px-2 py-2 text-white">
                            Make
                          </th>

                          <th className="px-2 py-2 text-white">
                            Brand
                          </th>

                          <th className="px-2 py-2 text-white">
                            Pattern
                          </th>

                          <th className="px-2 py-2 text-white text-nowrap">
                            Service Type
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {order.casings.map((casing) => (

                          <tr key={casing.orderCasingId}>

                            <td className="px-2 py-2">
                              {casing.tyreReferenceNumber}
                            </td>

                            <td className="px-2 py-2">
                              {casing.tyreReferenceNumber}
                            </td>

                            <td className="px-2 py-2">
                              {casing.dotNumber}
                            </td>

                            <td className="px-2 py-2">
                              {casing.tyreSizeLabel}
                            </td>

                            <td className="px-2 py-2">
                              {casing.tyreMakeName}
                            </td>

                            <td className="px-2 py-2">
                              {casing.tyreMakeName}
                            </td>

                            <td className="px-2 py-2">
                              {casing.patternName || "-"}
                            </td>

                            <td className="px-2 py-2">
                              <span className="badge rounded-pill bg-info-subtle text-primary">
                                {casing.serviceTypeName}
                              </span>
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CUSTOMER VERIFICATION
              ================================================== */}

              <div className="card border-0 shadow-sm">

                <div className="card-body p-3">
                  <div className="d-flex align-items-center gap-2 mb-1">

                    <div
                      className="d-flex align-items-center justify-content-center bg-danger-subtle text-danger rounded-3 flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      <i className="bi bi-shield-check" />
                    </div>

                    <h5 className="mb-0 fw-bold fs-6">
                      Customer Verification & Approval
                    </h5>

                  </div>

                  <p className="mb-3 text-secondary small">
                    Please verify the above dispatched casing(s) and confirm
                    if they are received in good condition.
                  </p>


                  {/* CUSTOMER DETAILS */}

                  <div className="row g-2 mb-3">

                    {/* Representative */}
                    <div className="col-12 col-md-4">

                      <label className="form-label fw-semibold mb-1 small">
                        Customer Representative
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={customerRepresentative}
                        onChange={(e) =>
                          setCustomerRepresentative(e.target.value)
                        }
                        placeholder="Enter representative name"
                      />

                    </div>

                    {/* Mobile */}
                    <div className="col-12 col-md-4">

                      <label className="form-label fw-semibold mb-1 small">
                        Mobile Number
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter mobile number"
                      />

                    </div>


                    {/* Email */}
                    <div className="col-12 col-md-4">

                      <label className="form-label fw-semibold mb-1 small">
                        Email Address
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="Enter email address"
                      />

                    </div>

                  </div>


                  {/* CONDITION / REMARKS / SIGNATURE */}
                  <div>
                    <div className="row g-2">

                      {/* Condition */}
                      <div className="col-12 col-lg-4">

                        <label className="form-label fw-semibold mb-1 small">
                          Casing Condition
                        </label>

                        <select
                          className="form-select"
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                        >
                          <option value="Received in Good Condition">
                            Received in Good Condition
                          </option>

                          <option value="Received with Minor Damage">
                            Received with Minor Damage
                          </option>

                          <option value="Received with Damage">
                            Received with Damage
                          </option>

                          <option value="Not Received">
                            Not Received
                          </option>
                        </select>

                      </div>

                      {/* Remarks */}
                      <div className="col-12 col-lg-8">

                        <label className="form-label fw-semibold mb-1 small">
                          Remarks{" "}
                          <span className="text-muted fw-normal">
                            (Optional)
                          </span>
                        </label>

                        <textarea
                          className="form-control"
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Enter any remarks..."
                          rows={3}
                        />

                      </div>

                    </div>

                    {/* Signature */}

                    <div className="col-12">
                      <label className="form-label fw-semibold small">
                        Customer Signature
                      </label>

                      <div
                        className="position-relative border border-danger-subtle rounded-3 bg-white overflow-hidden"
                        style={{ height: "150px" }}
                      >
                        <canvas
                          ref={canvasRef}
                          width={1200}
                          height={300}
                          className="w-100 h-100"
                          style={{
                            display: "block",
                            touchAction: "none",
                            cursor: "crosshair",
                          }}
                          onPointerDown={startDrawing}
                          onPointerMove={draw}
                          onPointerUp={stopDrawing}
                          onPointerCancel={stopDrawing}
                          onPointerLeave={stopDrawing}
                        />

                        {!hasSignature && (
                          <div className="position-absolute top-50 start-50 translate-middle text-muted small">
                            Sign here
                          </div>
                        )}

                        {hasSignature && (
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute bottom-0 end-0 m-2"
                            onClick={clearSignature}
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>

                  </div>


                  {/* =================================================
                      CONFIRMATION
                  ================================================== */}

                  <div
                    className="d-flex align-items-center gap-2 mt-3 p-2 rounded-3"
                    style={{
                      background:
                        "#f0fcf4",
                      border:
                        "1px solid #bce8ce",
                    }}
                  >

                    <div className="d-flex align-items-center justify-content-center flex-shrink-0">
                      <i className="bi bi-check-lg" />
                    </div>


                    <div>

                      <div
                        className="fw-bold"
                        style={{
                          fontSize:
                            "12px",
                        }}
                      >
                        Confirmation
                      </div>

                      <div
                        style={{
                          color:
                            "#667085",
                          fontSize:
                            "10px",
                        }}
                      >
                        By approving, you confirm
                        that all dispatched casing(s)
                        have been received as per the
                        order.
                      </div>

                    </div>

                  </div>


                  {/* MESSAGE */}

                  {message && (

                    <div
                      className={`alert mt-2 mb-0 py-2 ${message.includes(
                        "successfully"
                      )
                        ? "alert-success"
                        : "alert-danger"
                        }`}
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {message}
                    </div>

                  )}

                </div>

              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-2 px-3 py-2">

              {/* Back */}

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >

                <i className="bi bi-arrow-left me-2" />

                Back

              </button>


              <div className="d-flex flex-column flex-sm-row gap-2">

                {/* Approve */}

                <button
                  type="button"
                  className="btn text-white"
                  onClick={
                    handleApprove
                  }
                  disabled={approving}
                  style={{
                    height: "40px",
                    minWidth: "190px",
                    borderRadius: "8px",
                    background:
                      "#159447",
                    border:
                      "1px solid #159447",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >

                  {approving ? (

                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Approving...
                    </>

                  ) : (

                    <>
                      <i className="bi bi-check-circle me-2" />

                      Approve & Confirm

                    </>

                  )}

                </button>

              </div>

            </div>

          </div>

        </div>

      </div >
    </>
  );
};

export default CustomerDispatchApprovalModal;