import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";
import { RingLoader } from "react-spinners";

import customerApprovalService from "../services/customerApprovalService";

type Props = {
  selectedOrder: any;
  onClose: () => void;
  onSuccess: () => Promise<void> | void;
};

const CustomerApprovalModal = ({
  selectedOrder,
  onClose,
  onSuccess,
}: Props) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [customerRepresentative, setCustomerRepresentative] =
    useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [countryCode, setCountryCode] = useState("+91");

  const [emailName, setEmailName] = useState("");

  const [emailDomain, setEmailDomain] = useState("");

  const [emailExtension, setEmailExtension] = useState("com");

  const [saving, setSaving] = useState(false);

  // ============================================================
  // NEW UI FIELDS
  // These are currently UI-only and are NOT added to API payload.
  // ============================================================

  const [casingCondition, setCasingCondition] = useState(
    "Received in Good Condition",
  );

  const [remarks, setRemarks] = useState("");

  const generatedEmail =
    emailName && emailDomain && emailExtension
      ? `${emailName}@${emailDomain}.${emailExtension}`
      : "";

  const handleApprove = async () => {
    try {
      if (signatureRef.current?.isEmpty()) {
        alert("Please add customer signature");
        return;
      }

      setSaving(true);

      const payload = {
        orderIds: [String(selectedOrder?.items?.[0]?.orderId)],

        customerRepresentative,

        phoneNumber: countryCode + phoneNumber,

        emailAddress: generatedEmail,
      };

      await customerApprovalService.confirmCustomerOrder(payload);

      await onSuccess();

      alert(
        "I confirm that the above listed tyres/casings have been collected correctly and handed over for the requested services. ",
      );

      onClose();
    } catch (e) {
      console.log(e);

      alert("Approval Failed");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DISPLAY DATA
  // ============================================================

  const order = selectedOrder?.items?.[0];

  const orderNumber =
    order?.orderNumber || selectedOrder?.orderNo || "-";

  const customerName =
    order?.customer?.customerName || "-";

  const totalCasings =
    order?.casings?.length || 0;

  const orderDate = order?.createdAtUtc
    ? new Date(order.createdAtUtc).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";

  const casings = order?.casings || [];

  return (
    <>
      {/* ========================================================
          LOADER
      ======================================================== */}
      {saving && (
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

      {/* ========================================================
          MODAL
      ======================================================== */}
      <div
        className="modal fade show"
        tabIndex={-1}
        style={{
          display: "block",
          background: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 shadow-lg rounded-3 overflow-hidden">

            {/* ==================================================
                HEADER
            ================================================== */}
            <div className="modal-header bg-danger text-white border-0 px-4 py-3">
              <div className="d-flex align-items-center gap-3">

                <div
                  className="d-flex justify-content-center align-items-center rounded"
                  style={{
                    width: "45px",
                    height: "45px",
                    background: "rgba(255,255,255,0.15)",
                  }}
                >
                  <i className="bi bi-shield-check fs-2"></i>
                </div>

                <div>
                  <h4 className="modal-title fw-bold mb-0">
                    Customer Approval
                  </h4>

                  <small className="opacity-75">
                    Verify and confirm collected casing order
                  </small>
                </div>

              </div>

              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
                disabled={saving}
              />
            </div>

            {/* ==================================================
                BODY
            ================================================== */}
            <div className="modal-body bg-light p-4">

              {/* ==================================================
                  ORDER INFORMATION
              ================================================== */}
              <div className="card border-0 shadow-sm rounded-3 mb-4">

                <div className="card-body p-3">

                  <div className="d-flex align-items-center gap-2 mb-3">

                    <div
                      className="d-flex justify-content-center align-items-center rounded"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#fff0f1",
                        color: "#dc3545",
                      }}
                    >
                      <i className="bi bi-file-earmark-text"></i>
                    </div>

                    <h5 className="fw-bold mb-0">
                      Order Information
                    </h5>

                  </div>

                  <div className="row g-3">

                    {/* ORDER NO */}
                    <div className="col-lg-3 col-md-6">
                      <div className="border rounded-3 p-3 bg-white">
                        <div className="text-muted small fw-semibold mb-2">
                          Order No
                        </div>

                        <div className="text-danger fw-bold">
                          {orderNumber}
                        </div>
                      </div>
                    </div>

                    {/* CUSTOMER */}
                    <div className="col-lg-5 col-md-6">
                      <div className="border rounded-3 p-3 bg-white">
                        <div className="text-muted small fw-semibold mb-2">
                          Customer Name
                        </div>

                        <div className="fw-semibold">
                          {customerName}
                        </div>
                      </div>
                    </div>

                    {/* ORDER DATE */}
                    <div className="col-lg-2 col-md-6">
                      <div className="border rounded-3 p-3 bg-white">
                        <div className="text-muted small fw-semibold mb-2">
                          <i className="bi bi-calendar3 me-1"></i>
                          Order Date
                        </div>

                        <div className="fw-semibold">
                          {orderDate}
                        </div>
                      </div>
                    </div>

                    {/* TOTAL CASINGS */}
                    <div className="col-lg-2 col-md-6">
                      <div className="border rounded-3 p-3 bg-white">
                        <div className="text-muted small fw-semibold mb-2">
                          <i className="bi bi-box-seam me-1"></i>
                          Total Casings
                        </div>

                        <div className="fw-semibold">
                          {totalCasings}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* ==================================================
                  CASING ORDER
              ================================================== */}
              <div className="card border-0 shadow-sm rounded-3 mb-4">

                <div className="card-body p-3">

                  <div className="d-flex align-items-center gap-2 mb-3">

                    <div
                      className="d-flex justify-content-center align-items-center rounded"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#fff0f1",
                        color: "#dc3545",
                      }}
                    >
                      <i className="bi bi-box-seam"></i>
                    </div>

                    <h5 className="fw-bold mb-0">
                      Casing Order
                    </h5>

                  </div>

                  <div className="table-responsive border rounded-3">

                    <table className="table table-hover align-middle mb-0">

                      <thead className="table-danger">

                        <tr>
                          <th className="text-nowrap">
                            Tyre Ref No
                          </th>

                          <th className="text-nowrap">
                            Other No
                          </th>

                          <th className="text-nowrap">
                            DOT No
                          </th>

                          <th className="text-nowrap">
                            Is Retreaded
                          </th>

                          <th className="text-nowrap">
                            Tyre Size
                          </th>

                          <th className="text-nowrap">
                            Make
                          </th>

                          <th className="text-nowrap">
                            Brand
                          </th>

                          <th className="text-nowrap">
                            Pattern
                          </th>

                          <th className="text-nowrap">
                            Service Type
                          </th>
                        </tr>

                      </thead>

                      <tbody>

                        {casings.length > 0 ? (
                          casings.map((casing: any) => (
                            <tr key={casing.orderCasingId}>

                              <td>
                                {casing.tyreReferenceNumber || "-"}
                              </td>

                              <td>
                                {casing.otherNumber || "-"}
                              </td>

                              <td>
                                {casing.dotNumber || "-"}
                              </td>

                              <td>
                                <span
                                  className={`badge ${
                                    casing.isRetreaded
                                      ? "bg-success"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {casing.isRetreaded
                                    ? "Yes"
                                    : "No"}
                                </span>
                              </td>

                              <td>
                                {casing.tyreSize?.casingSize || "-"}
                              </td>

                              <td>
                                {casing.tyreMake?.name || "-"}
                              </td>

                              <td>
                                {casing.retreadDetail?.brand || "-"}
                              </td>

                              <td>
                                {casing.retreadDetail?.patternName || "-"}
                              </td>

                              <td>
                                <span className="badge bg-info-subtle text-primary border border-primary-subtle">
                                  {casing.serviceType?.name || "-"}
                                </span>
                              </td>

                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={9}
                              className="text-center text-muted py-4"
                            >
                              No casing order found.
                            </td>
                          </tr>
                        )}

                      </tbody>

                    </table>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  CUSTOMER VERIFICATION
              ================================================== */}
              <div className="card border-0 shadow-sm rounded-3">

                <div className="card-body p-3">

                  <div className="d-flex align-items-center gap-2 mb-2">

                    <div
                      className="d-flex justify-content-center align-items-center rounded"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "#fff0f1",
                        color: "#dc3545",
                      }}
                    >
                      <i className="bi bi-shield-check"></i>
                    </div>

                    <h5 className="fw-bold mb-0">
                      Customer Verification &amp; Approval
                    </h5>

                  </div>

                  <p className="text-muted small mb-4">
                    Please verify the above casing order and
                    confirm the condition of the casings received
                    from the customer.
                  </p>

                  {/* ==================================================
                      CUSTOMER REPRESENTATIVE / MOBILE / EMAIL
                  ================================================== */}
                  <div className="row g-3 mb-3">

                    {/* REPRESENTATIVE */}
                    <div className="col-lg-4">

                      <label className="form-label fw-semibold small">
                        Customer Representative
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter representative name"
                        value={customerRepresentative}
                        disabled={saving}
                        onChange={(e) =>
                          setCustomerRepresentative(e.target.value)
                        }
                      />

                    </div>

                    {/* PHONE */}
                    <div className="col-lg-4">

                      <label className="form-label fw-semibold small">
                        Mobile Number
                      </label>

                      <input
                        className="form-control"
                        value={
                          order?.customer?.mobileNumber || "-"
                        }
                        readOnly
                      />

                    </div>

                    {/* EMAIL */}
                    <div className="col-lg-4">

                      <label className="form-label fw-semibold small">
                        Email Address
                      </label>

                      <input
                        className="form-control"
                        value={order?.customer?.email || "-"}
                        readOnly
                      />

                    </div>

                  </div>

                  {/* ==================================================
                      CASING CONDITION + REMARKS
                  ================================================== */}
                  <div className="row g-3 mb-3">

                    {/* CASING CONDITION */}
                    <div className="col-lg-4">

                      <label className="form-label fw-semibold small">
                        Casing Condition
                      </label>

                      <select
                        className="form-select"
                        value={casingCondition}
                        disabled={saving}
                        onChange={(e) =>
                          setCasingCondition(e.target.value)
                        }
                      >
                        <option value="Received in Good Condition">
                          Received in Good Condition
                        </option>

                        <option value="Received with Minor Damage">
                          Received with Minor Damage
                        </option>

                        <option value="Received with Major Damage">
                          Received with Major Damage
                        </option>

                        <option value="Received in Poor Condition">
                          Received in Poor Condition
                        </option>
                      </select>

                    </div>

                    {/* REMARKS */}
                    <div className="col-lg-8">

                      <label className="form-label fw-semibold small">
                        Remarks <span className="text-muted">(Optional)</span>
                      </label>

                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Enter any remarks..."
                        value={remarks}
                        disabled={saving}
                        onChange={(e) =>
                          setRemarks(e.target.value)
                        }
                      />

                    </div>

                  </div>

                  {/* ==================================================
                      CUSTOMER SIGNATURE
                  ================================================== */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold small">
                      Customer Signature
                    </label>

                    <div
                      className="position-relative border border-danger-subtle rounded-3 bg-white overflow-hidden"
                      style={{
                        height: "150px",
                      }}
                    >

                      <SignatureCanvas
                        ref={signatureRef}
                        penColor="black"
                        canvasProps={{
                          width: 1000,
                          height: 150,
                          className: "w-100 h-100",
                        }}
                      />

                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute bottom-0 end-0 m-2"
                        onClick={() =>
                          signatureRef.current?.clear()
                        }
                        disabled={saving}
                      >
                        Clear
                      </button>

                    </div>

                  </div>

                  {/* ==================================================
                      CONFIRMATION
                  ================================================== */}
                  <div className="alert alert-success d-flex align-items-center gap-3 mt-3 mb-0 border-success-subtle">

                    <div
                      className="rounded-circle bg-success text-white d-flex justify-content-center align-items-center flex-shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <i className="bi bi-check-lg fs-5"></i>
                    </div>

                    <div>

                      <div className="fw-semibold">
                        Confirmation
                      </div>

                      <div className="small text-muted">
                        By approving, you confirm that all casings
                        listed above have been collected correctly
                        as per the order.
                      </div>

                    </div>

                  </div>

                </div>
              </div>

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}
            <div className="modal-footer bg-white border-top px-4 py-3">

              <button
                type="button"
                className="btn btn-light border px-4"
                onClick={onClose}
                disabled={saving}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>

              <div className="d-flex gap-3 ms-auto">

                <button
                  type="button"
                  className="btn btn-success px-4"
                  disabled={saving}
                  onClick={handleApprove}
                >
                  <i
                    className={`bi ${
                      saving
                        ? "bi-hourglass-split"
                        : "bi-check-circle"
                    } me-2`}
                  ></i>

                  {saving
                    ? "Approving..."
                    : "Customer Approval"}
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerApprovalModal;