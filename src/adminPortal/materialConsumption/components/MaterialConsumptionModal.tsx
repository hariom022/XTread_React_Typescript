import { useState, useEffect } from "react";

import type { MaterialConsumption } from "../types/materialConsumption.type";

import materialConsumptionApiService from "../services/materialConsumptionApiService";

interface Props {
  materialConsumption: MaterialConsumption | null;
  show: boolean;
  onClose: () => void;
}

const MaterialConsumptionModal = ({
  materialConsumption,
  show,
  onClose,
}: Props) => {
  /*
   * ==========================================================
   * APPROVE STATE
   * ==========================================================
   */

  const [approving, setApproving] = useState<boolean>(false);

  const [approveError, setApproveError] = useState<string>("");

  const [approved, setApproved] = useState<boolean>(false);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [editedMaterials, setEditedMaterials] = useState(
    materialConsumption?.materialConsumed ?? [],
  );

  useEffect(() => {
    setEditedMaterials(materialConsumption?.materialConsumed ?? []);
    setEditingIndex(null);
  }, [materialConsumption]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleConsumedQuantityChange = (index: number, value: string) => {
    setEditedMaterials((prev) =>
      prev.map((material, i) =>
        i === index
          ? {
              ...material,
              consumedQuantity: Number(value),
            }
          : material,
      ),
    );
  };
  
  const handleSave = async (index: number) => {
  const material = editedMaterials[index];

  if (!material) {
    return;
  }

  if (!material.orderCasingMaterialConsumptionId) {
    console.error(
      "orderCasingMaterialConsumptionId is missing."
    );
    return;
  }

  const consumedQuantity = Number(
    material.consumedQuantity ?? 0
  );

  if (consumedQuantity < 0) {
    console.error("Consumed quantity cannot be negative.");
    return;
  }

  try {
    console.log("Updating consumed quantity:", {
      orderCasingMaterialConsumptionId:
        material.orderCasingMaterialConsumptionId,
      consumedQuantity,
    });

    await materialConsumptionApiService.updateConsumedQuantity(
      material.orderCasingMaterialConsumptionId,
      consumedQuantity
    );

    // API update successful
    setEditingIndex(null);

  } catch (error) {
    console.error(
      "Failed to update consumed quantity:",
      error
    );
  }
};
  /*
   * ==========================================================
   * APPROVE MATERIAL CONSUMPTION
   * ==========================================================
   */

  const handleApprove = async () => {
    if (!materialConsumption) {
      return;
    }

    try {
      setApproving(true);
      setApproveError("");

      await materialConsumptionApiService.approveMaterialConsumption(
        materialConsumption.orderCasingId,
      );

      /*
       * API approval successful
       */

      setApproved(true);
    } catch (error) {
      console.error("Failed to approve material consumption:", error);

      setApproveError(
        error instanceof Error
          ? error.message
          : "Failed to approve Material Consumption.",
      );
    } finally {
      setApproving(false);
    }
  };

  /*
   * ==========================================================
   * RESET / CLOSE
   * ==========================================================
   */

  const handleClose = () => {
    setApproveError("");
    setApproving(false);
    setApproved(false);

    onClose();
  };

  if (!show || !materialConsumption) {
    return null;
  }

  /*
   * ==========================================================
   * MODAL
   * ==========================================================
   */

  const calculateDeviation = (
    recommendedQuantity: number | null | undefined,
    consumedQuantity: number | null | undefined,
  ): number => {
    const recommended = Number(recommendedQuantity ?? 0);
    const consumed = Number(consumedQuantity ?? 0);

    if (recommended === 0) {
      return 0;
    }

    return ((consumed - recommended) / recommended) * 100;
  };
  return (
    <>
      {/* =====================================================
          BACKDROP
      ====================================================== */}

      <div className="modal-backdrop fade show" onClick={handleClose} />

      {/* =====================================================
          MODAL
      ====================================================== */}

      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="
            modal-dialog
            modal-xl
            modal-dialog-centered
            modal-dialog-scrollable
          "
          role="document"
        >
          <div className="modal-content">
            {/* =================================================
                HEADER
            ================================================== */}

            <div className="modal-header">
              <div>
                <h5
                  className="modal-title"
                  style={{
                    color: "#12385c",
                    fontWeight: 600,
                  }}
                >
                  Material Consumption
                </h5>

                <small className="text-muted">
                  Order:{" "}
                  <strong>{materialConsumption.orderNumber || "-"}</strong>
                </small>
              </div>

              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              />
            </div>

            {/* =================================================
                BODY
            ================================================== */}

            <div className="modal-body">
              {/* =================================================
                  CASING INFORMATION
              ================================================== */}

              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="small text-muted">Order Number</div>

                  <div className="fw-semibold">
                    {materialConsumption.orderNumber || "-"}
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="small text-muted">Tyre Reference</div>

                  <div className="fw-semibold">
                    {materialConsumption.tyreReferenceNumber || "-"}
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="small text-muted">Production Number</div>

                  <div className="fw-semibold">
                    {materialConsumption.productionNumber || "-"}
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="small text-muted">Batch Number</div>

                  <div className="fw-semibold">
                    {materialConsumption.batchNumber || "-"}
                  </div>
                </div>
              </div>

              {/* =================================================
                  APPROVAL SUCCESS
              ================================================== */}

              {approved && (
                <div
                  className="alert alert-success d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2" />

                  <div>
                    Material consumption has been approved successfully.
                  </div>
                </div>
              )}

              {/* =================================================
                  APPROVAL ERROR
              ================================================== */}

              {approveError && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2" />

                  <div>{approveError}</div>
                </div>
              )}

              {/* =================================================
                  MATERIAL DETAILS HEADER
              ================================================== */}

              <div
                className="
                  d-flex
                  justify-content-between
                  align-items-center
                  mb-3
                "
              >
                <h6
                  className="mb-0"
                  style={{
                    color: "#12385c",
                    fontWeight: 600,
                  }}
                >
                  Material Details
                </h6>

                <span className="badge bg-light text-primary border">
                  {materialConsumption.materialConsumed?.length || 0}{" "}
                  Material(s)
                </span>
              </div>

              {/* =================================================
                  MATERIAL TABLE
              ================================================== */}

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead>
                    <tr
                      style={{
                        background: "#ff2738",
                      }}
                    >
                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        #
                      </th>

                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Material
                      </th>

                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Material Description
                      </th>

                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Consumption Type
                      </th>
                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Recommended Quantity
                      </th>
                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Consumed Quantity
                      </th>
                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        % Deviation
                      </th>
                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Unit
                      </th>

                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Casing Stage
                      </th>

                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Approval Status
                      </th>
                      <th
                        className="text-white"
                        style={{
                          padding: "12px 10px",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {materialConsumption.materialConsumed &&
                    materialConsumption.materialConsumed.length > 0 ? (
                      editedMaterials.map(
                        (material, index) => (
                          <tr
                            key={`${materialConsumption.orderCasingId}-${index}`}
                          >
                            {/* # */}

                            <td>{index + 1}</td>

                            {/* Material */}

                            <td className="fw-semibold">
                              {material.material || "-"}
                            </td>

                            {/* Prod Hierarchy */}

                            <td>{material.materialDescription || "-"}</td>

                            {/* Consumption Type */}

                            <td>
                              <span className="badge bg-light text-dark border">
                                {material.consumptionType === 1
                                  ? "Fixed"
                                  : material.consumptionType === 2
                                    ? "Variable"
                                    : "-"}
                              </span>
                            </td>
                            <td className="fw-semibold">
                              {material.recommendedQuantity ?? 0}
                            </td>
                            {/* Quantity */}

                            <td className="fw-semibold">
                              {editingIndex === index ? (
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={material.consumedQuantity ?? 0}
                                  min="0"
                                  step="any"
                                  onChange={(e) =>
                                    handleConsumedQuantityChange(
                                      index,
                                      e.target.value,
                                    )
                                  }
                                  style={{ width: "120px" }}
                                />
                              ) : (
                                (material.consumedQuantity ?? 0)
                              )}
                            </td>

                            <td className="fw-semibold">
                              {calculateDeviation(
                                material.recommendedQuantity,
                                material.consumedQuantity,
                              ).toFixed(2)}
                              %
                            </td>
                            {/* Unit */}

                            <td>{material.unitOfMeasure || "-"}</td>

                            {/* Casing Stage */}

                            <td>
                              <span className="badge bg-light text-primary border">
                                {material.casingStageName || "-"}
                              </span>
                            </td>

                            {/* Approval Status */}

                            <td>
                              {approved || material.isApproved ? (
                                <span className="badge bg-success-subtle text-success">
                                  <i className="bi bi-check-circle me-1" />
                                  Approved
                                </span>
                              ) : (
                                <span className="badge bg-warning-subtle text-warning-emphasis">
                                  <i className="bi bi-clock me-1" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td>
                              {editingIndex === index ? (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleSave(index)}
                                  title="Save"
                                >
                                  <i className="bi bi-check-lg"></i>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(index)}
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-4 text-muted">
                          No material consumption details found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* =================================================
                FOOTER
            ================================================== */}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={approving}
              >
                Close
              </button>

              {/* =================================================
                  APPROVE BUTTON
              ================================================== */}

              {!approved && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApprove}
                  disabled={approving}
                >
                  {approving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Approving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1" />
                      Approve
                    </>
                  )}
                </button>
              )}

              {/* =================================================
                  ALREADY APPROVED
              ================================================== */}

              {approved && (
                <button type="button" className="btn btn-success" disabled>
                  <i className="bi bi-check-circle-fill me-1" />
                  Approved
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialConsumptionModal;
