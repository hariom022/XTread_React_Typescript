import SignatureCanvas from "react-signature-canvas";

import { useRef, useState } from "react";

import customerApprovalService from "../services/customerApprovalService";

type Props = {
  selectedOrder: any;

  onClose: () => void;

  onSuccess: () => void;
};

const CustomerApprovalModal = ({
  selectedOrder,
  onClose,
  onSuccess,
}: Props) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [customerRepresentative, setCustomerRepresentative] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [countryCode, setCountryCode] = useState("+91");

  const [emailName, setEmailName] = useState("");

  const [emailDomain, setEmailDomain] = useState("");

  const [emailExtension, setEmailExtension] = useState("com");

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

      const payload = {
        orderIds: [String(selectedOrder?.items?.[0]?.orderId)],

        customerRepresentative,

        phoneNumber: countryCode + phoneNumber,

        emailAddress: generatedEmail,
      };

      await customerApprovalService.confirmCustomerOrder(payload);

      alert("Customer Approved Successfully");

      onSuccess();

      onClose();
    } catch (e) {
      console.log(e);

      alert("Approval Failed");
    }
  };

  return (
    <div
      className="modal fade show"
      style={{
        display: "block",
        background: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Customer Approval</h5>

            <button className="btn-close btn-close-white" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Order No</label>

                <input
                  className="form-control"
                  value={selectedOrder?.items?.[0]?.orderNumber}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Customer Name</label>

                <input
                  className="form-control"
                  value={selectedOrder?.items?.[0]?.customer?.customerName}
                  readOnly
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-semibold">Total Casings</label>

                <input
                  className="form-control"
                  value={selectedOrder?.items?.[0]?.casings?.length}
                  readOnly
                />
              </div>
            </div>

            <div className="border rounded p-3 bg-light">
              <h5 className="fw-bold mb-3">Customer Confirmation</h5>

              <p>
                I confirm that the above listed tyres/casings have been
                collected correctly and handed over for the requested services.
              </p>

              <div className="row">
                {/* REPRESENTATIVE */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">
                    Customer Representative
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter representative name"
                    value={customerRepresentative}
                    onChange={(e) => setCustomerRepresentative(e.target.value)}
                  />
                </div>

                {/* PHONE */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">Phone Number</label>

                  <div className="d-flex">
                    <select
                      className="form-select"
                      style={{
                        maxWidth: "110px",
                      }}
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      <option value="+91">+91</option>

                      <option value="+1">+1</option>
                    </select>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) =>
                        setPhoneNumber(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>

                  <div className="d-flex align-items-center gap-2">
                    <input
                      className="form-control"
                      placeholder="john"
                      value={emailName}
                      onChange={(e) => setEmailName(e.target.value)}
                    />

                    <span>@</span>

                    <input
                      className="form-control"
                      placeholder="gmail"
                      value={emailDomain}
                      onChange={(e) => setEmailDomain(e.target.value)}
                    />

                    <span>.</span>

                    <select
                      className="form-select"
                      value={emailExtension}
                      onChange={(e) => setEmailExtension(e.target.value)}
                    >
                      <option value="com">com</option>

                      <option value="org">org</option>
                    </select>
                  </div>

                  <small className="text-muted">
                    Generated Email:
                    <b> {generatedEmail || "-"}</b>
                  </small>
                </div>

                {/* SIGNATURE */}
                <div className="col-md-12 mb-3">
                  <label className="form-label fw-semibold">
                    Customer Signature
                  </label>

                  <div
                    className="border rounded bg-white"
                    style={{
                      width: "100%",
                      height: "220px",
                    }}
                  >
                    <SignatureCanvas
                      ref={signatureRef}
                      penColor="black"
                      canvasProps={{
                        width: 1000,
                        height: 220,
                        className: "signatureCanvas w-100",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => signatureRef.current?.clear()}
            >
              Clear Signature
            </button>

            <button className="btn btn-success" onClick={handleApprove}>
              Customer Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerApprovalModal;
