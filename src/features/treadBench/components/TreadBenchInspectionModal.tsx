import { useState, useEffect } from "react";
import type { TreadBenchInspectionModalProps } from "../types/treadBenchTypes";

const TreadBenchInspectionModal = ({
  selectedItem,
  staffName,
  cementTypes,
  loadCementTypes,
  handleSave,
  onClose,
}: TreadBenchInspectionModalProps) => {
  const [consumptionKg, setConsumptionKg] = useState("");
  const [cementType, setCementType] = useState("");

  useEffect(() => {
    loadCementTypes();
  }, [loadCementTypes]);

  if (!selectedItem) return null;

  const onSave = async () => {
    try {
      const payload = {
        orderCasingIds: [selectedItem.id.toString()],
        cementTypeId: Number(cementType),
        consumptionEstimateKgs: consumptionKg,
      };

      console.log("SAVE PAYLOAD", payload);

      await handleSave(payload);

      alert("Saved Successfully");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Save Failed");
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header stock-mgt text-white">
            <h5 className="modal-title flex-grow-1">
              TREAD BENCH – INSPECTION
            </h5>

            <div
              className="me-3 text-white text-end"
              style={{ marginLeft: "45rem" }}
            >
              <b>{staffName}</b>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>

          {/* BODY */}
          <div className="modal-body">
            {/* Row 1 */}

            <div className="mb-3">
              <div className="modal-info m-0 p-2 row text-nowrap">
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
                  <div>{selectedItem?.customerName || "-"}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{selectedItem?.tyreSize}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>{selectedItem?.requestedPattern || "-"}</div>
                </div>

                <div className="col">
                  <strong>ReApproved Pattern</strong>
                  <div>{selectedItem?.reApprovedPattern || "-"}</div>
                </div>
              </div>
            </div>
            <hr />

            <div className="container-fluid my-4">
              <div
                className="border rounded-3 p-3 mb-3"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderColor: "#dee2e6",
                }}
              >
                {/* Production Number */}
                <div className="text-center mb-3">
                  <div
                    className="fw-bold text-dark"
                    style={{ fontSize: "16px" }}
                  >
                    Production No
                  </div>

                  <div
                    className="fw-bold text-dark"
                    style={{ fontSize: "18px" }}
                  >
                    {selectedItem.casing || "-"}
                  </div>
                </div>

                {/* Divider */}
                <hr className="my-2" />

                {/* Details */}
                <div className="row g-3 mt-1">
                  <div className="col-md-6">
                    <div>
                      <span className="fw-bold">Brand:</span>{" "}
                      <span>{selectedItem.brand || "-"}</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div>
                      <span className="fw-bold">Circumference:</span>{" "}
                      <span>{selectedItem.circumference || "-"}</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div>
                      <span className="fw-bold">Pattern:</span>{" "}
                      <span>{selectedItem.requestedPattern || "-"}</span>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div>
                      <span className="fw-bold">Width:</span>{" "}
                      <span>{selectedItem.width || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-end g-3">
                {/* Consumption */}
                <div className="col-md-4">
                  <label className="form-label">
                    Consumption Estimate (kgs)
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    value={consumptionKg}
                    onChange={(e) => setConsumptionKg(e.target.value)}
                  />
                </div>

                {/* Cement Type */}
                <div className="col-md-4">
                  <label className="form-label">Cement Type</label>

                  <select
                    className="form-select"
                    value={cementType}
                    onChange={(e) => setCementType(e.target.value)}
                  >
                    <option value="">Select Cement Type</option>

                    {cementTypes?.map((item) => (
                      <option key={item.cementTypeId} value={item.cementTypeId}>
                        {item.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Save */}
                <div className="col-md-4">
                  <button
                    className="btn btn-success w-100"
                    style={{ height: "45px" }}
                    onClick={onSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* end body */}
        </div>
      </div>
    </div>
  );
};

export default TreadBenchInspectionModal;
