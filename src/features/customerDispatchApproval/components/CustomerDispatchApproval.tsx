// src/features/customerDispatchApproval/components/CustomerDispatchApproval.tsx

import {
  useEffect,
  useRef,
  useState,
} from "react";

import useCustomerDispatchApproval from "../hooks/useCustomerDispatchApproval";

interface Props {
  orderNo?: string;
  onClose?: () => void;
  onBack?: () => void;
}

const CustomerDispatchApproval = ({
  orderNo,
  onClose,
  onBack,
}: Props) => {
  const {
    data,
    loading,
    approving,

    customerRepresentative,
    setCustomerRepresentative,

    mobileNumber,
    setMobileNumber,

    emailAddress,
    setEmailAddress,

    condition,
    setCondition,

    remarks,
    setRemarks,

    signature,
    setSignature,

    message,

    approveCustomer,
  } = useCustomerDispatchApproval(orderNo);

  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] =
    useState(false);

  const [hasSignature, setHasSignature] =
    useState(false);

  /*
   * Clear canvas when signature is removed
   */
  useEffect(() => {
    if (!signature) {
      const canvas = canvasRef.current;

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

      setHasSignature(false);
    }
  }, [signature]);

  /*
   * Get mouse/touch coordinates
   */
  const getCoordinates = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect =
      canvas.getBoundingClientRect();

    if ("touches" in event) {
      const touch = event.touches[0];

      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  /*
   * Start signature drawing
   */
  const startDrawing = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const { x, y } =
      getCoordinates(event);

    context.beginPath();

    context.moveTo(x, y);

    context.lineWidth = 2;

    context.lineCap = "round";

    context.lineJoin = "round";

    context.strokeStyle = "#222222";

    setIsDrawing(true);
  };

  /*
   * Draw signature
   */
  const draw = (
    event:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) => {
    event.preventDefault();

    if (!isDrawing) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const { x, y } =
      getCoordinates(event);

    context.lineTo(x, y);

    context.stroke();

    setHasSignature(true);
  };

  /*
   * Stop signature drawing
   */
  const stopDrawing = () => {
    if (!isDrawing) {
      return;
    }

    setIsDrawing(false);

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const signatureImage =
      canvas.toDataURL("image/png");

    setSignature(signatureImage);
  };

  /*
   * Clear signature
   */
  const clearSignature = () => {
    const canvas = canvasRef.current;

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

  /*
   * Loading
   */
  if (loading) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "500px",
          background: "#f5f7fa",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border"
            style={{
              color: "#e52d3d",
            }}
          />

          <div
            className="mt-3"
            style={{
              color: "#667085",
            }}
          >
            Loading customer approval...
          </div>
        </div>
      </div>
    );
  }

  /*
   * No data
   */
  if (!data) {
    return (
      <div
        className="alert alert-danger m-4"
        role="alert"
      >
        Unable to load customer approval details.
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: "#f5f7fa",
        color: "#252b33",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div
        className="d-flex align-items-center justify-content-between px-3 px-md-4"
        style={{
          minHeight: "90px",
          background:
            "linear-gradient(90deg, #df2638, #e52d3d, #d92135)",
          color: "#ffffff",
          boxShadow:
            "0 3px 10px rgba(0,0,0,0.12)",
        }}
      >
        <div className="d-flex align-items-center gap-3">

          {/* Icon */}

          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "48px",
              height: "48px",
              border:
                "2px solid rgba(255,255,255,0.85)",
              borderRadius: "12px",
              fontSize: "23px",
            }}
          >
            <i className="bi bi-shield-check" />
          </div>

          {/* Title */}

          <div>
            <h2
              className="mb-0 fw-bold"
              style={{
                fontSize: "25px",
              }}
            >
              Customer Approval
            </h2>

            <p
              className="mb-0 mt-1"
              style={{
                fontSize: "14px",
                opacity: 0.92,
              }}
            >
              Verify and approve dispatched
              casings
            </p>
          </div>
        </div>

        {/* Close */}

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="btn d-flex align-items-center justify-content-center"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "9px",
              background: "#ffffff",
              color: "#df2638",
              border: "0",
              fontSize: "20px",
            }}
          >
            <i className="bi bi-x-lg" />
          </button>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="container-fluid"
        style={{
          maxWidth: "1600px",
          padding: "25px",
        }}
      >

        {/* =================================================
            ORDER INFORMATION
        ================================================== */}

        <div
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "13px",
          }}
        >
          <div className="card-body p-3 p-md-4">

            {/* Section Heading */}

            <div className="d-flex align-items-center gap-3 mb-4">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "#fff0f2",
                  color: "#e52d3d",
                }}
              >
                <i className="bi bi-file-earmark-text" />
              </div>

              <h3
                className="mb-0 fw-bold"
                style={{
                  fontSize: "20px",
                  color: "#17202a",
                }}
              >
                Order Information
              </h3>
            </div>

            {/* Order Information */}

            <div className="row g-3">

              {/* Order Number */}

              <div className="col-12 col-lg-4">

                <div
                  className="border rounded-3 h-100 p-3"
                  style={{
                    minHeight: "82px",
                  }}
                >
                  <div
                    className="small fw-semibold mb-1"
                    style={{
                      color: "#697586",
                    }}
                  >
                    Order No
                  </div>

                  <div
                    className="fw-bold"
                    style={{
                      color: "#e52d3d",
                      fontSize: "16px",
                    }}
                  >
                    {data.orderNo}
                  </div>
                </div>

              </div>

              {/* Customer Name */}

              <div className="col-12 col-lg-5">

                <div
                  className="border rounded-3 h-100 p-3"
                  style={{
                    minHeight: "82px",
                  }}
                >
                  <div
                    className="small fw-semibold mb-1"
                    style={{
                      color: "#697586",
                    }}
                  >
                    Customer Name
                  </div>

                  <div
                    className="fw-semibold"
                    style={{
                      color: "#26313d",
                      fontSize: "15px",
                    }}
                  >
                    {data.customerName}
                  </div>
                </div>

              </div>

              {/* Dispatch Date + Total */}

              <div className="col-12 col-lg-3">

                <div
                  className="border rounded-3 h-100 p-3"
                  style={{
                    minHeight: "82px",
                  }}
                >
                  <div className="row h-100">

                    <div className="col-7">

                      <div
                        className="small fw-semibold mb-1"
                        style={{
                          color: "#697586",
                        }}
                      >
                        Dispatch Date
                      </div>

                      <div
                        className="fw-semibold d-flex align-items-center gap-1"
                        style={{
                          color: "#26313d",
                          fontSize: "13px",
                        }}
                      >
                        <i className="bi bi-calendar3" />

                        {data.dispatchDate}
                      </div>

                    </div>

                    <div className="col-5 border-start">

                      <div
                        className="small fw-semibold mb-1 ms-2"
                        style={{
                          color: "#697586",
                        }}
                      >
                        Total
                      </div>

                      <div
                        className="fw-bold ms-2 d-flex align-items-center gap-1"
                        style={{
                          color: "#26313d",
                          fontSize: "16px",
                        }}
                      >
                        <i className="bi bi-box" />

                        {data.totalCasings}
                      </div>

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
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "13px",
          }}
        >
          <div className="card-body p-3 p-md-4">

            {/* Heading */}

            <div className="d-flex align-items-center gap-3 mb-4">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "#fff0f2",
                  color: "#e52d3d",
                }}
              >
                <i className="bi bi-truck" />
              </div>

              <h3
                className="mb-0 fw-bold"
                style={{
                  fontSize: "20px",
                  color: "#17202a",
                }}
              >
                Dispatched Items
              </h3>

            </div>

            {/* Table */}

            <div
              className="table-responsive border rounded-3"
              style={{
                overflowX: "auto",
              }}
            >
              <table
                className="table mb-0 align-middle"
                style={{
                  minWidth: "1100px",
                }}
              >

                <thead>
                  <tr
                    style={{
                      background:
                        "linear-gradient(90deg, #e52d3d, #f02d3d)",
                      color: "#ffffff",
                    }}
                  >

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Tyre Ref No
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                      }}
                    >
                      Other No
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                      }}
                    >
                      DOT No
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Is Retreaded
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Tyre Size
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                      }}
                    >
                      Make
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                      }}
                    >
                      Brand
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                      }}
                    >
                      Pattern
                    </th>

                    <th
                      className="px-3 py-3"
                      style={{
                        color: "#ffffff",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Service Type
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {data.items.map(
                    (item, index) => (
                      <tr
                        key={`${item.tyreRefNo}-${index}`}
                      >

                        <td className="px-3 py-3">
                          {item.tyreRefNo}
                        </td>

                        <td className="px-3 py-3">
                          {item.otherNo}
                        </td>

                        <td className="px-3 py-3">
                          {item.dotNo}
                        </td>

                        <td className="px-3 py-3">

                          {item.isRetreaded ? (
                            <span
                              className="badge rounded-pill"
                              style={{
                                background:
                                  "#e9f8ef",
                                color:
                                  "#159447",
                                fontSize:
                                  "11px",
                              }}
                            >
                              <i className="bi bi-check-circle-fill me-1" />

                              Yes
                            </span>
                          ) : (
                            <span className="badge bg-danger">
                              No
                            </span>
                          )}

                        </td>

                        <td className="px-3 py-3">
                          {item.tyreSize}
                        </td>

                        <td className="px-3 py-3">
                          {item.make}
                        </td>

                        <td className="px-3 py-3">
                          {item.brand}
                        </td>

                        <td className="px-3 py-3">
                          {item.pattern}
                        </td>

                        <td className="px-3 py-3">

                          <span
                            className="badge rounded-pill"
                            style={{
                              background:
                                "#eef7ff",
                              color:
                                "#1670d2",
                              border:
                                "1px solid #77b5ff",
                            }}
                          >
                            {item.serviceType}
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
          className="card border-0 shadow-sm mb-4"
          style={{
            borderRadius: "13px",
          }}
        >
          <div className="card-body p-3 p-md-4">

            {/* Heading */}

            <div className="d-flex align-items-center gap-3 mb-2">

              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "#fff0f2",
                  color: "#e52d3d",
                }}
              >
                <i className="bi bi-shield-check" />
              </div>

              <h3
                className="mb-0 fw-bold"
                style={{
                  fontSize: "20px",
                  color: "#17202a",
                }}
              >
                Customer Verification & Approval
              </h3>

            </div>

            <p
              className="mb-4"
              style={{
                color: "#667085",
                fontSize: "14px",
              }}
            >
              Please verify the above dispatched
              casing(s) and confirm if they are
              received in good condition.
            </p>


            {/* =============================================
                CUSTOMER DETAILS
            ============================================== */}

            <div className="row g-3 mb-4">

              {/* Representative */}

              <div className="col-12 col-md-4">

                <label className="form-label fw-semibold">
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
                    height: "48px",
                    borderRadius: "10px",
                  }}
                />

              </div>


              {/* Mobile */}

              <div className="col-12 col-md-4">

                <label className="form-label fw-semibold">
                  Mobile Number
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={mobileNumber}
                  onChange={(e) =>
                    setMobileNumber(
                      e.target.value
                    )
                  }
                  placeholder="Enter mobile number"
                  style={{
                    height: "48px",
                    borderRadius: "10px",
                  }}
                />

              </div>


              {/* Email */}

              <div className="col-12 col-md-4">

                <label className="form-label fw-semibold">
                  Email Address
                </label>

                <input
                  type="email"
                  className="form-control"
                  value={emailAddress}
                  onChange={(e) =>
                    setEmailAddress(
                      e.target.value
                    )
                  }
                  placeholder="Enter email address"
                  style={{
                    height: "48px",
                    borderRadius: "10px",
                  }}
                />

              </div>

            </div>


            {/* =============================================
                CONDITION / REMARKS / SIGNATURE
            ============================================== */}

            <div className="row g-3">

              {/* Condition */}

              <div className="col-12 col-lg-4">

                <label className="form-label fw-semibold">
                  Casing Condition
                </label>

                <select
                  className="form-select"
                  value={condition}
                  onChange={(e) =>
                    setCondition(
                      e.target.value
                    )
                  }
                  style={{
                    height: "48px",
                    borderRadius: "10px",
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

                <label className="form-label fw-semibold">
                  Remarks{" "}
                  <span
                    className="fw-normal"
                    style={{
                      color: "#98a2b3",
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
                  rows={4}
                  style={{
                    minHeight: "105px",
                    borderRadius: "10px",
                    resize: "vertical",
                  }}
                />

              </div>


              {/* Signature */}

              <div className="col-12 col-lg-4">

                <div className="d-flex justify-content-between align-items-center">

                  <label className="form-label fw-semibold">
                    Customer Signature
                  </label>

                  {hasSignature && (
                    <button
                      type="button"
                      className="btn btn-sm mb-2"
                      onClick={
                        clearSignature
                      }
                      style={{
                        background:
                          "#fff0f2",
                        color:
                          "#df2638",
                        border: "0",
                      }}
                    >
                      Clear
                    </button>
                  )}

                </div>

                <div
                  className="position-relative"
                  style={{
                    height: "105px",
                    border:
                      "1.5px solid #e52d3d",
                    borderRadius: "10px",
                    background:
                      "#ffffff",
                    overflow: "hidden",
                  }}
                >

                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={180}
                    className="w-100 h-100"
                    style={{
                      display: "block",
                      cursor: "crosshair",
                      touchAction:
                        "none",
                    }}
                    onMouseDown={
                      startDrawing
                    }
                    onMouseMove={draw}
                    onMouseUp={
                      stopDrawing
                    }
                    onMouseLeave={
                      stopDrawing
                    }
                    onTouchStart={
                      startDrawing
                    }
                    onTouchMove={draw}
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
                          "14px",
                      }}
                    >
                      Sign here
                    </div>
                  )}

                </div>

              </div>

            </div>


            {/* =============================================
                CONFIRMATION
            ============================================== */}

            <div
              className="d-flex align-items-center gap-3 mt-4 p-3 rounded-3"
              style={{
                background: "#f0fcf4",
                border:
                  "1px solid #bce8ce",
              }}
            >

              <div
                className="d-flex align-items-center justify-content-center flex-shrink-0"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    "#159447",
                  color: "#ffffff",
                }}
              >
                <i className="bi bi-check-lg" />
              </div>

              <div>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "13px",
                  }}
                >
                  Confirmation
                </div>

                <div
                  style={{
                    color: "#667085",
                    fontSize: "12px",
                  }}
                >
                  By approving, you confirm
                  that all dispatched casing(s)
                  have been received as per the
                  order.
                </div>

              </div>

            </div>


            {/* =============================================
                SUCCESS / ERROR MESSAGE
            ============================================== */}

            {message && (
              <div
                className={`alert mt-3 mb-0 ${
                  message.includes(
                    "successfully"
                  )
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {message}
              </div>
            )}

          </div>
        </div>

      </div>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div
        className="sticky-bottom mt-auto"
        style={{
          background:
            "rgba(255,255,255,0.97)",
          borderTop:
            "1px solid #e1e5ea",
          boxShadow:
            "0 -3px 15px rgba(0,0,0,0.05)",
          zIndex: 20,
        }}
      >

        <div
          className="container-fluid d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-2"
          style={{
            maxWidth: "1600px",
            padding: "14px 25px",
          }}
        >

          {/* Back */}

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onBack}
            style={{
              minWidth: "125px",
              height: "45px",
              borderRadius: "9px",
              fontWeight: 600,
            }}
          >
            <i className="bi bi-arrow-left me-2" />

            Back
          </button>


          {/* Right Buttons */}

          <div className="d-flex flex-column flex-sm-row gap-2">

            {/* Save Draft */}

            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{
                height: "45px",
                borderRadius: "9px",
                minWidth: "135px",
                fontWeight: 600,
              }}
              onClick={() => {
                console.log(
                  "Save Draft"
                );
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
                approveCustomer
              }
              disabled={approving}
              style={{
                height: "45px",
                minWidth: "215px",
                borderRadius: "9px",
                background:
                  "#159447",
                border:
                  "1px solid #159447",
                fontWeight: 700,
              }}
            >
              {approving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
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
  );
};

export default CustomerDispatchApproval;