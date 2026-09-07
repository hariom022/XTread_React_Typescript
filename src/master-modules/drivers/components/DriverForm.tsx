import { useEffect, useState } from "react";

import type {
  CourierService,
  CreateDriverRequest,
  Driver,
  UpdateDriverRequest,
} from "../types/drivers.type";

interface DriverFormProps {
  courierServices: CourierService[];

  courierServicesLoading: boolean;

  selectedCourierServiceId: number | null;

  onCourierServiceChange: (
    courierServiceId: number
  ) => void;

  editingDriver: Driver | null;

  submitting: boolean;

  onCreate: (
    request: CreateDriverRequest
  ) => Promise<void>;

  onUpdate: (
    driverId: number,
    request: UpdateDriverRequest
  ) => Promise<void>;

  onCancelEdit: () => void;
}

const DriverForm = ({
  courierServices,
  courierServicesLoading,
  selectedCourierServiceId,
  onCourierServiceChange,
  editingDriver,
  submitting,
  onCreate,
  onUpdate,
  onCancelEdit,
}: DriverFormProps) => {
  const [driverName, setDriverName] =
    useState<string>("");

  const [driverIdNo, setDriverIdNo] =
    useState<string>("");

  const [contactNumber, setContactNumber] =
    useState<string>("");

  const [isActive, setIsActive] =
    useState<boolean>(true);

  const [formError, setFormError] =
    useState<string>("");

  /*
   * ==========================================================
   * LOAD EDIT DATA
   * ==========================================================
   */

  useEffect(() => {
    if (editingDriver) {
      setDriverName(
        editingDriver.driverName
      );

      setDriverIdNo(
        editingDriver.driverIdNo
      );

      setContactNumber(
        editingDriver.contactNumber || ""
      );

      setIsActive(
        editingDriver.isActive
      );

      setFormError("");

      /*
       * Set Courier Service from driver details.
       *
       * The PUT API does not accept courierServiceId,
       * so it is displayed but disabled during edit.
       */

      onCourierServiceChange(
        editingDriver.courierServiceId
      );
    } else {
      resetForm();
    }
  }, [editingDriver]);

  /*
   * ==========================================================
   * RESET FORM
   * ==========================================================
   */

  const resetForm = () => {
    setDriverName("");
    setDriverIdNo("");
    setContactNumber("");
    setIsActive(true);
    setFormError("");
  };

  /*
   * ==========================================================
   * SUBMIT
   * ==========================================================
   */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setFormError("");

    /*
     * Courier Service validation
     */

    if (!selectedCourierServiceId) {
      setFormError(
        "Courier Service is required."
      );

      return;
    }

    /*
     * Driver Name validation
     */

    if (!driverName.trim()) {
      setFormError(
        "Driver Name is required."
      );

      return;
    }

    /*
     * Driver ID validation
     */

    if (!driverIdNo.trim()) {
      setFormError(
        "Driver ID No is required."
      );

      return;
    }

    /*
     * Contact validation
     */

    if (!contactNumber.trim()) {
      setFormError(
        "Contact Number is required."
      );

      return;
    }

    try {
      if (editingDriver) {
        /*
         * PUT
         *
         * courierServiceId is NOT sent because
         * the PUT API does not accept it.
         */

        await onUpdate(
          editingDriver.driverId,
          {
            driverName:
              driverName.trim(),

            driverIdNo:
              driverIdNo.trim(),

            contactNumber:
              contactNumber.trim(),

            isActive,
          }
        );
      } else {
        /*
         * POST
         */

        await onCreate({
          courierServiceId:
            String(
              selectedCourierServiceId
            ),

          driverName:
            driverName.trim(),

          driverIdNo:
            driverIdNo.trim(),

          contactNumber:
            contactNumber.trim() || null,
        });
      }

      resetForm();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong.";

      setFormError(message);
    }
  };

  /*
   * ==========================================================
   * CANCEL EDIT
   * ==========================================================
   */

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  /*
   * ==========================================================
   * RESET WITHOUT CANCEL
   * ==========================================================
   */

  const handleReset = () => {
    if (editingDriver) {
      handleCancel();
    } else {
      resetForm();
    }
  };

  return (
    <div
      className="card border-0 shadow-sm mb-4"
      style={{
        
        margin: "0 auto",
        borderRadius: "6px",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="card-header bg-white border-bottom py-2 px-3">
        <h2
          className="mb-0"
          style={{
            fontSize: "27px",
            fontWeight: 500,
            color: "#111111",
          }}
        >
          {editingDriver
            ? "Update Driver"
            : "Driver Registration"}
        </h2>
      </div>

      {/* =====================================================
          FORM
      ====================================================== */}

      <form onSubmit={handleSubmit}>
        <div className="card-body p-3">
          {/* Error */}

          {formError && (
            <div
              className="alert alert-danger"
              role="alert"
            >
              {formError}
            </div>
          )}

          <div className="row g-4">
            {/* =================================================
                COURIER SERVICE
            ================================================== */}

            <div className="col-md-4">
              <label
                htmlFor="courierService"
                className="form-label fw-semibold"
              >
                Courier Service
              </label>

              <select
                id="courierService"
                className="form-select"
                value={
                  selectedCourierServiceId ?? ""
                }
                onChange={(event) =>
                  onCourierServiceChange(
                    Number(event.target.value)
                  )
                }
                disabled={
                  submitting ||
                  courierServicesLoading ||
                  !!editingDriver
                }
                style={{
                  height: "51px",
                  borderRadius: "7px",
                  fontSize: "16px",
                }}
              >
                <option value="">
                  {courierServicesLoading
                    ? "Loading courier services..."
                    : "Select Courier Service"}
                </option>

                {courierServices.map(
                  (service) => (
                    <option
                      key={
                        service.courierServiceId
                      }
                      value={
                        service.courierServiceId
                      }
                    >
                      {service.courierName}
                    </option>
                  )
                )}
              </select>

              {editingDriver && (
                <small className="text-muted">
                  Courier Service cannot be changed
                  while editing because the update
                  API does not accept courierServiceId.
                </small>
              )}
            </div>

            {/* =================================================
                DRIVER NAME
            ================================================== */}

            <div className="col-md-4">
              <label
                htmlFor="driverName"
                className="form-label fw-semibold"
              >
                Driver Name
              </label>

              <input
                id="driverName"
                type="text"
                className="form-control"
                placeholder="Enter driver name"
                value={driverName}
                onChange={(event) =>
                  setDriverName(
                    event.target.value
                  )
                }
                disabled={submitting}
                style={{
                  height: "51px",
                  borderRadius: "7px",
                  fontSize: "16px",
                }}
              />
            </div>

            {/* =================================================
                DRIVER ID
            ================================================== */}

            <div className="col-md-4">
              <label
                htmlFor="driverIdNo"
                className="form-label fw-semibold"
              >
                Driver ID No
              </label>

              <input
                id="driverIdNo"
                type="text"
                className="form-control"
                placeholder="Enter driver ID number"
                value={driverIdNo}
                onChange={(event) =>
                  setDriverIdNo(
                    event.target.value
                  )
                }
                disabled={submitting}
                style={{
                  height: "51px",
                  borderRadius: "7px",
                  fontSize: "16px",
                }}
              />
            </div>

            {/* =================================================
                CONTACT NUMBER
            ================================================== */}

            <div className="col-md-4">
              <label
                htmlFor="contactNumber"
                className="form-label fw-semibold"
              >
                Contact Number
              </label>

              <input
                id="contactNumber"
                type="tel"
                className="form-control"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(event) =>
                  setContactNumber(
                    event.target.value
                  )
                }
                disabled={submitting}
                style={{
                  height: "51px",
                  borderRadius: "7px",
                  fontSize: "16px",
                }}
              />
            </div>

            {/* =================================================
                ACTIVE
            ================================================== */}

            {editingDriver && (
              <div className="col-md-4 d-flex align-items-center">
                <div className="form-check mt-4">
                  <input
                    id="driverActive"
                    type="checkbox"
                    className="form-check-input"
                    checked={isActive}
                    onChange={(event) =>
                      setIsActive(
                        event.target.checked
                      )
                    }
                    disabled={submitting}
                  />

                  <label
                    htmlFor="driverActive"
                    className="form-check-label"
                  >
                    Active
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              BUTTONS
          ================================================== */}

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              disabled={submitting}
            >
              Reset
            </button>

            <button
              type="submit"
              className="btn text-white"
              disabled={
                submitting ||
                courierServicesLoading
              }
              style={{
                background: "#ff2738",
                borderColor: "#ff2738",
              }}
            >
              {submitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <i
                    className={
                      editingDriver
                        ? "bi bi-pencil-square me-2"
                        : "bi bi-person-plus me-2"
                    }
                  />

                  {editingDriver
                    ? "Update Driver"
                    : "Add Driver"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DriverForm;