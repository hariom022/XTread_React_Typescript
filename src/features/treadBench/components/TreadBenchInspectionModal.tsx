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
            <div className="row text-center mb-2">
              <div className="col-md-2">
                <small className="fw-semibold">Production No</small>
                <div>{selectedItem.productionNumber}</div>
              </div>

              <div className="col-md-2">
                <small className="fw-semibold">Customer Name</small>
                <div>{selectedItem.customerName}</div>
              </div>

              <div className="col-md-2">
                <small className="fw-semibold">Tyre Size</small>
                <div>{selectedItem.tyreSize}</div>
              </div>

              <div className="col-md-2">
                <small className="fw-semibold">Service</small>
                <div>{selectedItem.service}</div>
              </div>
               <div className="col-md-2">
                <small className="fw-semibold">Request Pattern</small>
                <div>{selectedItem.pattern}</div>
                
              </div>
               <div className="col-md-2">
                <small className="fw-semibold">ReApproved Pattern</small>
                <div>-</div>
              </div>
            </div>


            <hr />

            <div className="container-fluid my-4">
              <div
                className="border rounded p-3 mb-3"
                style={{
                  backgroundColor: "#f8f8f8",
                  border: "1px solid #d6d6d6",
                }}
              >
                <h5 className="fw-bold mb-3">Record [1 of 1]</h5>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <span className="fw-bold">Tyre Size:</span>{" "}
                    {selectedItem.tyreSize || "-"}
                  </div>

                  <div className="col-md-4">
                    <span className="fw-bold">Circumference:</span>{" "}
                    {selectedItem.circumference || "-"}
                  </div>

                  <div className="col-md-4">
                    <span className="fw-bold">Service:</span>{" "}
                    {selectedItem.service || "-"}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <span className="fw-bold">Brand:</span>{" "}
                    {selectedItem.brand || "-"}
                  </div>

                  <div className="col-md-4">
                    <span className="fw-bold">Pattern:</span>{" "}
                    {selectedItem.pattern || "-"}
                  </div>

                  <div className="col-md-4">
                    <span className="fw-bold">Width:</span>{" "}
                    {selectedItem.width || "-"}
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
