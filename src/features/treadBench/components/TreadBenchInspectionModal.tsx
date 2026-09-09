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
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title flex-grow-1 text-white text-start">
                TREAD BENCH – INSPECTION
              </h5>
              <div className="me-3 text-white text-end">
                <div>{staffName}</div>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* Top Info Banner (Matching postbuff-top style) */}
              <div className="mb-2">
                <div className="modal-info m-0 p-1 mb-1 postbuff-top row text-nowrap">
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

              {/* Main Two-Column Content Area */}
              <div className="row g-1">
                <div className="row align-items-stretch ">
                  {/* LEFT PANEL */}
                  <div className="col-md-6 p-1">
                    <div className="panel-box h-100">
                      <div className="panel-body left-panel-body h-100">
                        <div className="record-box p-3 text-start h-100">
                          <div className="record-header fw-bold mb-2">
                            Record [1 of 1]
                          </div>
                          <div className="row gx-5 gy-1">
                            <div className="record-item fs-6">
                              <b>Production No:</b>{" "}
                              <strong>
                                {selectedItem.casing || "-"}
                              </strong>
                            </div>
                            <div className="record-item">
                              <b>Brand:</b> {selectedItem.brand || "-"}
                            </div>
                            <div className="record-item">
                              <b>Circumference:</b>{" "}
                              {selectedItem.circumference || "-"}
                            </div>
                            <div className="record-item">
                              <b>Pattern:</b>{" "}
                              {selectedItem.requestedPattern || "-"}
                            </div>
                            <div className="record-item">
                              <b>Width:</b> {selectedItem.width || "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL */}
                  <div className="col-md-6 p-1">
                    <div className="panel-box h-100">
                      <div className="panel-body d-flex flex-column h-100">
                        <div className="w-100 mb-3 flex-grow-1">
                          <div className="row g-2 mt-1">
                            {/* Consumption Estimate */}
                            <div className="col-6">
                              <label className="form-label fw-semibold">
                                Consumption Estimate (kgs)
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={consumptionKg}
                                onChange={(e) =>
                                  setConsumptionKg(e.target.value)
                                }
                              />
                            </div>

                            {/* Cement Type */}
                            <div className="col-6">
                              <label className="form-label fw-semibold">
                                Cement Type
                              </label>
                              <select
                                className="form-select"
                                value={cementType}
                                onChange={(e) => setCementType(e.target.value)}
                              >
                                <option value="">Select Cement Type</option>
                                {cementTypes?.map((item) => (
                                  <option
                                    key={item.cementTypeId}
                                    value={item.cementTypeId}
                                  >
                                    {item.displayName}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* SAVE BUTTON (Styled exactly like APPROVED) */}
                        <div className="mt-2 mt-auto">
                          <button
                            className="btn-approve btn-action w-100 d-flex align-items-center justify-content-center"
                            onClick={onSave}
                          >
                            SAVE
                            {/* <span className="icon-box">
                              <i className="bi bi-check-lg"></i>
                            </span> */}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end body */}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default TreadBenchInspectionModal;
