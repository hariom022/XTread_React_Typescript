import useCustomerDeliveryOrderModal from "../hooks/useCustomerDeliveryOrderModal";
import dispatchServiceApi from "../service/dispatchServiceApi";

import type { DispatchTeam, CustomerCasing } from "../type/dispatch.types";

interface Props {
  show: boolean;

  dispatchTeam: DispatchTeam;

  setDispatchTeam: React.Dispatch<React.SetStateAction<DispatchTeam>>;

  isInternal: boolean;

  onClose: () => void;

  onSave?: (data: any) => void;
}

const CustomerDeliveryOrderModal = ({
  show,
  dispatchTeam,
  setDispatchTeam,
  isInternal,
  onClose,
  onSave,
}: Props) => {
  const modal = useCustomerDeliveryOrderModal(dispatchTeam);

  // ==========================================
  // DON'T RENDER IF MODAL IS CLOSED
  // ==========================================

  if (!show) {
    return null;
  }

  // ==========================================
  // SAVE CUSTOMER DELIVERY
  // ==========================================

  const handleSave = async () => {
    // ==========================================
    // CUSTOMER VALIDATION
    // ==========================================

    if (!modal.selectedCustomerId) {
      alert("Please select customer");

      return;
    }

    // ==========================================
    // SERVICE TYPE VALIDATION
    // ==========================================

    if (!modal.serviceType) {
      alert("Please select service type");

      return;
    }

    // ==========================================
    // CASING VALIDATION
    // ==========================================

    if (!modal.selectedCasings || modal.selectedCasings.length === 0) {
      alert("Please add at least one casing");

      return;
    }

    // ==========================================
    // GET ORDER CASING IDS
    // ==========================================

    const orderCasingIds = modal.selectedCasings.map(
      (casing) => casing.orderCasingId,
    );

    // ==========================================
    // COURIER TYPE
    //
    // External = 1
    // Internal = 2
    // ==========================================

    const courierType = isInternal ? 2 : 1;

    // ==========================================
    // COURIER SERVICE ID
    //
    // Internal = "0"
    // External = selected courier service ID
    // ==========================================

    const courierServiceId = isInternal
      ? "0"
      : (dispatchTeam.courierServiceId ?? "0");

    // ==========================================
    // VALIDATION FOR EXTERNAL
    // ==========================================

    if (
      !isInternal &&
      (!dispatchTeam.courierName ||
        !dispatchTeam.regNo ||
        !dispatchTeam.driverName ||
        !dispatchTeam.driverId)
    ) {
      alert("Please select courier details");

      return;
    }

    // ==========================================
    // VALIDATION FOR INTERNAL
    // ==========================================

    if (
      isInternal &&
      (!dispatchTeam.courierName.trim() ||
        !dispatchTeam.regNo.trim() ||
        !dispatchTeam.driverName.trim() ||
        !dispatchTeam.driverId.trim())
    ) {
      alert("Please enter all dispatch team details");

      return;
    }

    // ==========================================
    // DELIVERY SHEET PAYLOAD
    // ==========================================

    const payload = {
      orderCasingIds: orderCasingIds,

      courierType: courierType,

      courierServiceId: courierServiceId,

      courierName: dispatchTeam.courierName,

      vehicleRegNo: dispatchTeam.regNo,

      driverName: dispatchTeam.driverName,

      driverIdNo: dispatchTeam.driverId,

      remarks: "",
    };

    console.log("SAVE DELIVERY SHEET PAYLOAD:", payload);

    // ==========================================
    // CALL API
    // ==========================================

    try {
      const response = await dispatchServiceApi.saveDeliverySheet(payload);

      console.log("Delivery Sheet API Response:", response.data);

      if (response.data?.success) {
        alert("Customer delivery saved successfully");

        // Parent callback if required
        onSave?.(response.data);

        // Reset modal
        modal.reset();

        onClose();

        return;
      }

      alert(response.data?.error || "Failed to save customer delivery");
    } catch (error) {
      console.error("Error saving delivery sheet:", error);

      alert("Failed to save customer delivery");
    }
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const handleClose = () => {
    modal.reset();

    onClose();
  };

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* ======================================
                            HEADER
                        ====================================== */}

            <div className="modal-header">
              <h5 className="modal-title text-white">
                Customer Delivery Order
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={handleClose}
              />
            </div>

            {/* ======================================
                            BODY
                        ====================================== */}

            <div className="modal-body text-start">
              {/* ==================================
                                TOP SECTION
                            ================================== */}

              <div className="row mb-1">
                {/* ==================================
                                    LEFT SIDE
                                ================================== */}

                <div className="col-md-6 border p-2">
                  <h6>Delivery Order Details</h6>

                  {/* DATE */}

                  <div className="row">
                    <div className="col-md-12">
                      <label>Date</label>

                      <input
                        type="date"
                        className="form-control"
                        value={modal.deliveryDate}
                        onChange={(e) => modal.setDeliveryDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* CUSTOMER */}

                  <div className="mt-2">
                    <label>Customer Name</label>

                    <select
                      className="form-select"
                      value={modal.selectedCustomerId}
                      onChange={(e) =>
                        modal.setSelectedCustomerId(e.target.value)
                      }
                      disabled={modal.loadingCustomers}
                    >
                      <option value="">
                        {modal.loadingCustomers
                          ? "Loading Customers..."
                          : "-- Select Customer --"}
                      </option>

                      {modal.customers.map((customer) => (
                        <option
                          key={customer.customerNumber}
                          value={customer.customerNumber}
                        >
                          {customer.customerName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SERVICE TYPE */}

                  <div className="mt-2">
                    <label>Service Type</label>

                    <select
                      className="form-select"
                      value={modal.serviceType}
                      onChange={(e) => modal.setServiceType(e.target.value)}
                      disabled={modal.loadingServiceTypes}
                    >
                      <option value="">
                        {modal.loadingServiceTypes
                          ? "Loading Service Types..."
                          : "-- Select Service Type --"}
                      </option>

                      {modal.serviceTypes.map((serviceType) => (
                        <option
                          key={serviceType.serviceTypeId}
                          value={serviceType.serviceTypeId}
                        >
                          {serviceType.serviceTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ==================================
                                    RIGHT SIDE
                                ================================== */}

                <div className="col-md-6 border p-2">
                  <h6>Dispatch Team</h6>

                  {/* SALES REP */}

                  <div className="row">
                    <div className="col-md-12">
                      <label>Sales Rep</label>

                      <input
                        className="form-control"
                        value={dispatchTeam.salesRep}
                        readOnly
                        placeholder="Auto-filled based on customer"
                      />
                    </div>
                  </div>

                  {/* COURIER + REG NO */}

                  <div className="row mt-2">
                    {/* COURIER */}

                    <div className="col-md-6">
                      <label>Courier Service</label>

                      <input
                        className="form-control"
                        value={dispatchTeam.courierName}
                        readOnly={!isInternal}
                        onChange={(e) =>
                          setDispatchTeam((prev) => ({
                            ...prev,

                            courierName: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* REG NO */}

                    <div className="col-md-6">
                      <label>Reg No#</label>

                      <input
                        className="form-control"
                        value={dispatchTeam.regNo}
                        readOnly={!isInternal}
                        onChange={(e) =>
                          setDispatchTeam((prev) => ({
                            ...prev,

                            regNo: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* DRIVER + ID */}

                  <div className="row mt-2">
                    {/* DRIVER NAME */}

                    <div className="col-md-6">
                      <label>Driver Name</label>

                      <input
                        className="form-control"
                        value={dispatchTeam.driverName}
                        readOnly={!isInternal}
                        onChange={(e) =>
                          setDispatchTeam((prev) => ({
                            ...prev,

                            driverName: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* DRIVER ID */}

                    <div className="col-md-6">
                      <label>ID No#</label>

                      <input
                        className="form-control"
                        value={dispatchTeam.driverId}
                        readOnly={!isInternal}
                        onChange={(e) =>
                          setDispatchTeam((prev) => ({
                            ...prev,

                            driverId: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================
                                TABLE SECTION
                            ================================== */}

              <div className="row">
                {/* ==================================
                                    CUSTOMER CASING orders
                                ================================== */}

                <div className="col-md-6 border p-2">
                  <h6>Customer Casing Orders</h6>

                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr className="bg-new">
                        <th>Batch No</th>

                        <th>Production No</th>

                        <th>Tyre Size</th>

                        <th>+</th>
                      </tr>
                    </thead>

                    <tbody>
                      {modal.availableCasings.length > 0 ? (
                        modal.availableCasings.map((item: CustomerCasing) => (
                          <tr key={item.orderCasingId}>
                            <td>{item.batchNo}</td>

                            <td>{item.productionNo}</td>

                            <td>{item.tyreSize}</td>

                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={() => modal.handleAddCasing(item)}
                              >
                                +
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center text-muted">
                            {modal.loadingBatchCasings
                              ? "Loading Customer Casing Orders..."
                              : "No casings available"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ==================================
                                    SELECTED CASINGS
                                ================================== */}

                <div className="col-md-6">
                  <div className="border p-2 mb-2">
                    <h6>
                      Repaired & Retreaded Casings (
                      {modal.selectedCasings.length})
                    </h6>

                    <table className="table table-sm table-bordered">
                      <thead>
                        <tr className="bg-new">
                          <th>Service</th>

                          <th>Batch No</th>

                          <th>Production No</th>

                          <th>Tyre Size</th>

                          <th>Tyre Make</th>
                          <th>-</th>
                        </tr>
                      </thead>

                      <tbody>
                        {modal.selectedCasings.length > 0 ? (
                          modal.selectedCasings.map((item: CustomerCasing) => (
                            <tr key={item.orderCasingId}>
                              <td>{item.service}</td>

                              <td>{item.batchNo}</td>

                              <td>{item.productionNo}</td>

                              <td>{item.tyreSize}</td>

                              <td>{item.tyreMake}</td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger"
                                  onClick={() => modal.handleRemoveCasing(item)}
                                >
                                  -
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center text-muted">
                              No casings selected
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ==================================
                                FOOTER BUTTONS
                            ================================== */}

              <div className="d-flex justify-content-between mt-3">
                {/* CLOSE */}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  ← Close
                </button>

                {/* SAVE */}

                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={handleSave}
                  disabled={modal.loadingCustomers || modal.loadingServiceTypes}
                >
                  ✔ Save Customer Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BACKDROP */}

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default CustomerDeliveryOrderModal;
