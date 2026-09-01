import { useEffect, useRef, useState } from "react";

import type {
  CustomerApprovalRequest,
  CustomerDispatchOrderGroup,
} from "../types/customerDispatchApproval.type";

interface Props {
  order: CustomerDispatchOrderGroup;

  onClose: () => void;

  approveCustomer: (
    request: CustomerApprovalRequest
  ) => Promise<{
    success: boolean;
    message: string;
  }>;
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
    setMessage("");

    if (!customerRepresentative.trim()) {
      setMessage(
        "Please enter customer representative name."
      );

      return;
    }

    if (!mobileNumber.trim()) {
      setMessage(
        "Please enter mobile number."
      );

      return;
    }

    if (!hasSignature) {
      setMessage(
        "Please provide customer signature."
      );

      return;
    }

    try {
      setApproving(true);

      const request:
        CustomerApprovalRequest = {
        orderNo:
          order.orderNo,

        casingIds:
          order.casings.map(
            (casing) =>
              casing.orderCasingId
          ),

        customerRepresentative:
          customerRepresentative,

        mobileNumber:
          mobileNumber,

        emailAddress:
          emailAddress,

        condition:
          condition,

        remarks:
          remarks,

        signature:
          signature,
      };

      const response =
        await approveCustomer(
          request
        );

      setMessage(
        response.message
      );

      if (response.success) {
        console.log(
          "Approved successfully:",
          request
        );
      }

    } catch (error) {
      console.error(
        "Customer approval error:",
        error
      );

      setMessage(
        "Something went wrong while approving."
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
      {/* BACKDROP */}

      <div
        className="modal-backdrop fade show"
        style={{
          zIndex: 1040,
        }}
      />


      {/* MODAL */}

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        style={{
          zIndex: 1050,
          overflowY: "auto",
        }}
      >

        <div
          className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"
          style={{
            maxWidth: "1500px",
          }}
        >

          <div
            className="modal-content border-0"
            style={{
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >

            {/* =================================================
                HEADER
            ================================================== */}

            <div
              className="d-flex align-items-center justify-content-between px-3 px-md-4"
              style={{
                minHeight: "68px",

                background:
                  "linear-gradient(90deg, #df2638, #e52d3d, #d92135)",

                color: "#ffffff",
              }}
            >

              <div
                className="d-flex align-items-center gap-2"
              >

                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "38px",
                    height: "38px",
                    border:
                      "2px solid rgba(255,255,255,0.85)",
                    borderRadius: "9px",
                    fontSize: "18px",
                  }}
                >
                  <i className="bi bi-shield-check" />
                </div>


                <div>

                  <h4
                    className="mb-0 fw-bold"
                    style={{
                      fontSize: "20px",
                    }}
                  >
                    Customer Approval
                  </h4>

                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.9,
                    }}
                  >
                    Verify and approve dispatched
                    casings
                  </div>

                </div>

              </div>


              <button
                type="button"
                className="btn"
                onClick={onClose}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "7px",
                  background: "#ffffff",
                  color: "#df2638",
                  border: "0",
                  padding: 0,
                }}
              >
                <i className="bi bi-x-lg" />
              </button>

            </div>


            {/* =================================================
                BODY
            ================================================== */}

            <div
              className="modal-body p-2 p-md-3"
              style={{
                background: "#f5f7fa",
              }}
            >

              {/* =================================================
                  ORDER INFORMATION
              ================================================== */}

              <div
                className="card border-0 shadow-sm mb-3"
                style={{
                  borderRadius: "10px",
                }}
              >

                <div
                  className="card-body p-3"
                >

                  <div
                    className="d-flex align-items-center gap-2 mb-3"
                  >

                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#fff0f2",
                        color: "#e52d3d",
                        fontSize: "14px",
                      }}
                    >
                      <i className="bi bi-file-earmark-text" />
                    </div>

                    <h5
                      className="mb-0 fw-bold"
                      style={{
                        fontSize: "17px",
                      }}
                    >
                      Order Information
                    </h5>

                  </div>


                  <div className="row g-2">

                    {/* Order */}

                    <div className="col-12 col-lg-4">

                      <div
                        className="border rounded-3 p-2 h-100"
                      >

                        <small
                          className="fw-semibold d-block"
                          style={{
                            color: "#697586",
                            fontSize: "11px",
                          }}
                        >
                          Order No
                        </small>

                        <strong
                          style={{
                            color: "#e52d3d",
                            fontSize: "14px",
                          }}
                        >
                          {order.orderNo}
                        </strong>

                      </div>

                    </div>


                    {/* Customer */}

                    <div className="col-12 col-lg-5">

                      <div
                        className="border rounded-3 p-2 h-100"
                      >

                        <small
                          className="fw-semibold d-block"
                          style={{
                            color: "#697586",
                            fontSize: "11px",
                          }}
                        >
                          Customer Name
                        </small>

                        <strong
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {order.customerName}
                        </strong>

                      </div>

                    </div>


                    {/* Date / Total */}

                    <div className="col-12 col-lg-3">

                      <div
                        className="border rounded-3 p-2 h-100"
                      >

                        <div className="row">

                          <div className="col-7">

                            <small
                              className="fw-semibold d-block"
                              style={{
                                color: "#697586",
                                fontSize: "11px",
                              }}
                            >
                              Order Date
                            </small>

                            <strong
                              className="d-flex align-items-center gap-1"
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              <i className="bi bi-calendar3" />

                              {order.orderDate}

                            </strong>

                          </div>


                          <div
                            className="col-5 border-start"
                          >

                            <small
                              className="fw-semibold d-block ms-2"
                              style={{
                                color: "#697586",
                                fontSize: "11px",
                              }}
                            >
                              Total
                            </small>

                            <strong
                              className="ms-2"
                              style={{
                                fontSize: "14px",
                              }}
                            >
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

              <div
                className="card border-0 shadow-sm mb-3"
                style={{
                  borderRadius: "10px",
                }}
              >

                <div
                  className="card-body p-3"
                >

                  <div
                    className="d-flex align-items-center gap-2 mb-3"
                  >

                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#fff0f2",
                        color: "#e52d3d",
                        fontSize: "14px",
                      }}
                    >
                      <i className="bi bi-truck" />
                    </div>


                    <div>

                      <h5
                        className="mb-0 fw-bold"
                        style={{
                          fontSize: "17px",
                        }}
                      >
                        Dispatched Items
                      </h5>

                      <small
                        style={{
                          color: "#667085",
                          fontSize: "11px",
                        }}
                      >
                        {order.totalCasings}
                        {" "}
                        casing(s) dispatched
                      </small>

                    </div>

                  </div>


                  <div
                    className="table-responsive border rounded-3"
                  >

                    <table
                      className="table table-sm mb-0 align-middle"
                      style={{
                        minWidth: "950px",
                        fontSize: "12px",
                      }}
                    >

                      <thead>

                        <tr
                          style={{
                            background:
                              "linear-gradient(90deg, #e52d3d, #f02d3d)",
                          }}
                        >

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            Tyre Ref No
                          </th>

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                            }}
                          >
                            Other No
                          </th>

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                            }}
                          >
                            DOT No
                          </th>

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            Tyre Size
                          </th>

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                            }}
                          >
                            Make
                          </th>

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                            }}
                          >
                            Brand
                          </th>

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                            }}
                          >
                            Pattern
                          </th>

                          <th
                            className="px-2 py-2"
                            style={{
                              color: "#ffffff",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            Service Type
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {order.casings.map(
                          (casing) => (

                            <tr
                              key={
                                casing.orderCasingId
                              }
                            >

                              <td className="px-2 py-2">
                                {
                                  casing.tyreReferenceNumber
                                }
                              </td>

                              <td className="px-2 py-2">
                                {
                                  casing.tyreReferenceNumber
                                }
                              </td>

                              <td className="px-2 py-2">
                                {
                                  casing.dotNumber
                                }
                              </td>

                              <td className="px-2 py-2">
                                {
                                  casing.tyreSizeLabel
                                }
                              </td>

                              <td className="px-2 py-2">
                                {
                                  casing.tyreMakeName
                                }
                              </td>

                              <td className="px-2 py-2">
                                {
                                  casing.tyreMakeName
                                }
                              </td>

                              <td className="px-2 py-2">
                                {
                                  casing.patternName ||
                                  "-"
                                }
                              </td>

                              <td className="px-2 py-2">

                                <span
                                  className="badge rounded-pill"
                                  style={{
                                    background:
                                      "#eef7ff",
                                    color:
                                      "#1670d2",
                                    border:
                                      "1px solid #77b5ff",
                                    fontSize:
                                      "10px",
                                  }}
                                >
                                  {
                                    casing.serviceTypeName
                                  }
                                </span>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                </div>

              </div>


              {/* =================================================
                  CUSTOMER VERIFICATION
              ================================================== */}

              <div
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "10px",
                }}
              >

                <div
                  className="card-body p-3"
                >

                  <div
                    className="d-flex align-items-center gap-2 mb-1"
                  >

                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#fff0f2",
                        color: "#e52d3d",
                        fontSize: "14px",
                      }}
                    >
                      <i className="bi bi-shield-check" />
                    </div>


                    <h5
                      className="mb-0 fw-bold"
                      style={{
                        fontSize: "17px",
                      }}
                    >
                      Customer Verification & Approval
                    </h5>

                  </div>


                  <p
                    className="mb-3"
                    style={{
                      color: "#667085",
                      fontSize: "11px",
                    }}
                  >
                    Please verify the above
                    dispatched casing(s) and confirm
                    if they are received in good
                    condition.
                  </p>


                  {/* CUSTOMER DETAILS */}

                  <div className="row g-2 mb-3">

                    {/* Representative */}

                    <div className="col-12 col-md-4">

                      <label
                        className="form-label fw-semibold mb-1"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        Customer Representative
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          customerRepresentative
                        }
                        onChange={(e) =>
                          setCustomerRepresentative(
                            e.target.value
                          )
                        }
                        placeholder="Enter representative name"
                        style={{
                          height: "42px",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />

                    </div>


                    {/* Mobile */}

                    <div className="col-12 col-md-4">

                      <label
                        className="form-label fw-semibold mb-1"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        Mobile Number
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          mobileNumber
                        }
                        onChange={(e) =>
                          setMobileNumber(
                            e.target.value
                          )
                        }
                        placeholder="Enter mobile number"
                        style={{
                          height: "42px",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />

                    </div>


                    {/* Email */}

                    <div className="col-12 col-md-4">

                      <label
                        className="form-label fw-semibold mb-1"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        Email Address
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        value={
                          emailAddress
                        }
                        onChange={(e) =>
                          setEmailAddress(
                            e.target.value
                          )
                        }
                        placeholder="Enter email address"
                        style={{
                          height: "42px",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
                      />

                    </div>

                  </div>


                  {/* CONDITION / REMARKS / SIGNATURE */}

                  <div className="row g-2">

                    {/* Condition */}

                    <div className="col-12 col-lg-4">

                      <label
                        className="form-label fw-semibold mb-1"
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        Casing Condition
                      </label>

                      <select
                        className="form-select"
                        value={
                          condition
                        }
                        onChange={(e) =>
                          setCondition(
                            e.target.value
                          )
                        }
                        style={{
                          height: "42px",
                          borderRadius: "8px",
                          fontSize: "13px",
                        }}
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

                    <div className="col-12 col-lg-4">

                      <label
                        className="form-label fw-semibold mb-1"
                        style={{
                          fontSize: "12px",
                        }}
                      >

                        Remarks{" "}

                        <span
                          className="fw-normal"
                          style={{
                            color:
                              "#98a2b3",
                          }}
                        >
                          (Optional)
                        </span>

                      </label>

                      <textarea
                        className="form-control"
                        value={remarks}
                        onChange={(e) =>
                          setRemarks(
                            e.target.value
                          )
                        }
                        placeholder="Enter any remarks..."
                        rows={3}
                        style={{
                          minHeight:
                            "85px",
                          borderRadius:
                            "8px",
                          resize:
                            "vertical",
                          fontSize:
                            "13px",
                        }}
                      />

                    </div>


                    {/* Signature */}

                    <div className="col-12 col-lg-4">

                      <div
                        className="d-flex justify-content-between align-items-center"
                      >

                        <label
                          className="form-label fw-semibold mb-1"
                          style={{
                            fontSize:
                              "12px",
                          }}
                        >
                          Customer Signature
                        </label>


                        {hasSignature && (

                          <button
                            type="button"
                            className="btn btn-sm mb-1"
                            onClick={
                              clearSignature
                            }
                            style={{
                              background:
                                "#fff0f2",
                              color:
                                "#df2638",
                              border:
                                "0",
                              fontSize:
                                "11px",
                              padding:
                                "2px 8px",
                            }}
                          >
                            Clear
                          </button>

                        )}

                      </div>


                      <div
                        className="position-relative"
                        style={{
                          height: "85px",
                          border:
                            "1.5px solid #e52d3d",
                          borderRadius:
                            "8px",
                          background:
                            "#ffffff",
                          overflow:
                            "hidden",
                        }}
                      >

                        <canvas
                          ref={
                            canvasRef
                          }
                          width={600}
                          height={160}
                          className="w-100 h-100"
                          style={{
                            display:
                              "block",
                            cursor:
                              "crosshair",
                            touchAction:
                              "none",
                          }}
                          onMouseDown={
                            startDrawing
                          }
                          onMouseMove={
                            draw
                          }
                          onMouseUp={
                            stopDrawing
                          }
                          onMouseLeave={
                            stopDrawing
                          }
                          onTouchStart={
                            startDrawing
                          }
                          onTouchMove={
                            draw
                          }
                          onTouchEnd={
                            stopDrawing
                          }
                        />


                        {!hasSignature && (

                          <div
                            className="position-absolute top-50 start-50 translate-middle"
                            style={{
                              pointerEvents:
                                "none",
                              color:
                                "#c3c8d0",
                              fontSize:
                                "12px",
                            }}
                          >
                            Sign here
                          </div>

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

                    <div
                      className="d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius:
                          "50%",
                        background:
                          "#159447",
                        color:
                          "#ffffff",
                        fontSize:
                          "13px",
                      }}
                    >
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
                      className={`alert mt-2 mb-0 py-2 ${
                        message.includes(
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

            <div
              className="d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-2 px-3 py-2"
              style={{
                background:
                  "#ffffff",
                borderTop:
                  "1px solid #e1e5ea",
              }}
            >

              {/* Back */}

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
                style={{
                  minWidth: "100px",
                  height: "40px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >

                <i className="bi bi-arrow-left me-2" />

                Back

              </button>


              <div
                className="d-flex flex-column flex-sm-row gap-2"
              >

                {/* Save Draft */}

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    console.log(
                      "Save Draft"
                    );
                  }}
                  style={{
                    height: "40px",
                    minWidth: "120px",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >

                  <i className="bi bi-floppy me-2" />

                  Save Draft

                </button>


                {/* Approve */}

                <button
                  type="button"
                  className="btn text-white"
                  onClick={
                    handleApprove
                  }
                  disabled={
                    approving
                  }
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
                      <span
                        className="spinner-border spinner-border-sm me-2"
                      />

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

      </div>
    </>
  );
};

export default CustomerDispatchApprovalModal;