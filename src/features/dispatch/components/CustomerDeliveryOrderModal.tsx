import { useEffect } from "react";

import useCustomerDeliveryOrderModal from "../hooks/useCustomerDeliveryOrderModal";

import dispatchServiceApi from "../service/dispatchServiceApi";

import type {
  DispatchTeam,
  CustomerCasing,
} from "../type/dispatch.types";

interface Props {
  show: boolean;

  dispatchTeam: DispatchTeam;

  setDispatchTeam: React.Dispatch<
    React.SetStateAction<DispatchTeam>
  >;

  isInternal: boolean;

  onClose: () => void;

  onSave?: (data: any) => void;

  editDeliverySheet?: any;
}

const CustomerDeliveryOrderModal = ({
  show,
  dispatchTeam,
  setDispatchTeam,
  isInternal,
  onClose,
  onSave,
  editDeliverySheet,
}: Props) => {
  const modal =
    useCustomerDeliveryOrderModal(
      dispatchTeam,
      isInternal,
      setDispatchTeam,
    );

  // ==========================================
  // LOAD EDIT DATA
  // ==========================================

  useEffect(() => {
    if (
      !show ||
      !editDeliverySheet
    ) {
      return;
    }

    console.log(
      "========================================",
    );

    console.log(
      "EDIT DELIVERY SHEET:",
      editDeliverySheet,
    );

    console.log(
      "COURIER TYPE:",
      editDeliverySheet.courierType,
    );

    console.log(
      "COURIER SERVICE ID:",
      editDeliverySheet.courierServiceId,
    );

    console.log(
      "COURIER NAME:",
      editDeliverySheet.courierName,
    );

    console.log(
      "DRIVER ID:",
      editDeliverySheet.driverId,
    );

    console.log(
      "DRIVER NAME:",
      editDeliverySheet.driverName,
    );

    console.log(
      "DRIVER ID NO:",
      editDeliverySheet.driverIdNo,
    );

    console.log(
      "CASINGS:",
      editDeliverySheet.casings,
    );

    console.log(
      "========================================",
    );

    // ==========================================
    // DATE
    // ==========================================

    if (
      editDeliverySheet.createdAtUtc
    ) {
      const date =
        new Date(
          editDeliverySheet.createdAtUtc,
        )
          .toISOString()
          .split("T")[0];

      modal.setDeliveryDate(date);
    }

    // ==========================================
    // LOAD EXISTING CASINGS
    //
    // THIS FIXES RIGHT TABLE
    // ==========================================

    if (
      Array.isArray(
        editDeliverySheet.casings,
      )
    ) {
      modal.loadEditCasings(
        editDeliverySheet.casings,
      );
    } else {
      modal.loadEditCasings([]);
    }

    // ==========================================
    // SET COURIER / DRIVER DETAILS
    // ==========================================

    setDispatchTeam((prev) => ({
      ...prev,

      courierName:
        editDeliverySheet.courierName ??
        "",

      regNo:
        editDeliverySheet.vehicleRegNo ??
        "",

      driverName:
        editDeliverySheet.driverName ??
        "",

      driverId:
        Number(
          editDeliverySheet.driverId ??
            0,
        ),

      driverIdNo:
        editDeliverySheet.driverIdNo ??
        "",

      courierServiceId:
        Number(
          editDeliverySheet.courierServiceId ??
            0,
        ),
    }));
  }, [
    show,
    editDeliverySheet,
  ]);

  // ==========================================
  // SET CUSTOMER + SERVICE TYPE
  // ==========================================

  useEffect(() => {
    if (
      !show ||
      !editDeliverySheet
    ) {
      return;
    }

    const firstCasing =
      editDeliverySheet.casings?.[0];

    // ==========================================
    // CUSTOMER
    // ==========================================

    const customerName =
      firstCasing?.customerName;

    if (
      customerName &&
      modal.customers.length > 0
    ) {
      const customer =
        modal.customers.find(
          (item: any) =>
            item.customerName
              ?.trim()
              .toLowerCase() ===
            customerName
              .trim()
              .toLowerCase(),
        );

      if (customer) {
        console.log(
          "EDIT CUSTOMER:",
          customer,
        );

        modal.setSelectedCustomerId(
          customer.customerNumber,
        );
      }
    }

    // ==========================================
    // SERVICE TYPE
    // ==========================================

    const serviceName =
      firstCasing?.serviceType ??
      firstCasing?.serviceTypeName;

    if (
      serviceName &&
      modal.serviceTypes.length > 0
    ) {
      const service =
        modal.serviceTypes.find(
          (item: any) =>
            item.serviceTypeName
              ?.trim()
              .toLowerCase() ===
            serviceName
              .trim()
              .toLowerCase(),
        );

      if (service) {
        console.log(
          "EDIT SERVICE TYPE:",
          service,
        );

        modal.setServiceType(
          service.serviceTypeId.toString(),
        );
      }
    }
  }, [
    show,
    editDeliverySheet,
    modal.customers,
    modal.serviceTypes,
  ]);

  // ==========================================
  // DON'T RENDER
  // ==========================================

  if (!show) {
    return null;
  }

  // ==========================================
  // SAVE / UPDATE
  // ==========================================

  const handleSave = async () => {
    // ==========================================
    // CUSTOMER
    // ==========================================

    if (
      !modal.selectedCustomerId
    ) {
      alert(
        "Please select customer",
      );

      return;
    }

    // ==========================================
    // SERVICE
    // ==========================================

    if (!modal.serviceType) {
      alert(
        "Please select service type",
      );

      return;
    }

    // ==========================================
    // CASINGS
    // ==========================================

    if (
      modal.selectedCasings.length ===
      0
    ) {
      alert(
        "Please add at least one casing",
      );

      return;
    }

    // ==========================================
    // COURIER TYPE
    // ==========================================

    const courierType =
      isInternal ? 2 : 1;

    // ==========================================
    // COURIER SERVICE
    // ==========================================

    const courierServiceId =
      dispatchTeam.courierServiceId?.toString() ??
      "0";

    // ==========================================
    // VALIDATE COURIER SERVICE
    // ==========================================

    if (
      !dispatchTeam.courierServiceId
    ) {
      alert(
        "Please select Courier Service",
      );

      return;
    }

    // ==========================================
    // VALIDATE DRIVER
    // ==========================================

    if (
      !dispatchTeam.driverName
     
    ) {
      alert(
        "Please select/enter driver details",
      );

      return;
    }

    // ==========================================
    // EXTERNAL
    //
    // Reg No + Driver Name + ID required
    // ==========================================

    if (!isInternal) {
      if (
        !dispatchTeam.regNo ||
        !dispatchTeam.driverIdNo
      ) {
        alert(
          "Please enter vehicle and driver details",
        );

        return;
      }
    }

    // ==========================================
    // EDIT MODE
    // ==========================================

    if (
      editDeliverySheet?.deliverySheetId
    ) {
      const {
        addOrderCasingIds,
        removeOrderCasingIds,
      } =
        modal.getUpdateCasingIds();

      const updatePayload = {
        courierType,

        courierServiceId,

        courierName:
          dispatchTeam.courierName ||
          null,

        vehicleRegNo:
          dispatchTeam.regNo ||
          null,

        driverId:
          dispatchTeam.driverId ||
          null,

        driverName:
          dispatchTeam.driverName ||
          null,

        driverIdNo:
          dispatchTeam.driverIdNo ||
          null,

        remarks:
          editDeliverySheet.remarks ??
          "",

        addOrderCasingIds,

        removeOrderCasingIds,
      };

      console.log(
        "========================================",
      );

      console.log(
        "UPDATE DELIVERY SHEET ID:",
        editDeliverySheet.deliverySheetId,
      );

      console.log(
        "UPDATE DELIVERY SHEET PAYLOAD:",
        updatePayload,
      );

      console.log(
        "========================================",
      );

      try {
        const response =
          await dispatchServiceApi.updateDeliverySheet(
            editDeliverySheet.deliverySheetId,
            updatePayload,
          );

        console.log(
          "UPDATE RESPONSE:",
          response.data,
        );

        if (
          response.data?.success
        ) {
          alert(
            "Customer delivery updated successfully",
          );

          onSave?.(
            response.data,
          );

          modal.reset();

          onClose();

          return;
        }

        alert(
          response.data?.error ||
            "Failed to update customer delivery",
        );
      } catch (error) {
        console.error(
          "Error updating delivery sheet:",
          error,
        );

        alert(
          "Failed to update customer delivery",
        );
      }

      return;
    }

    // ==========================================
    // CREATE MODE
    // ==========================================

    const orderCasingIds =
      modal.selectedCasings.map(
        (casing) =>
          casing.orderCasingId,
      );

    const payload = {
      orderCasingIds,

      courierType,

      courierServiceId,

      courierName:
        dispatchTeam.courierName,

      vehicleRegNo:
        dispatchTeam.regNo,

      driverId:
        dispatchTeam.driverId,

      driverName:
        dispatchTeam.driverName,

      driverIdNo:
        dispatchTeam.driverIdNo,

      remarks: "",
    };

    console.log(
      "CREATE DELIVERY SHEET PAYLOAD:",
      payload,
    );

    try {
      const response =
        await dispatchServiceApi.saveDeliverySheet(
          payload,
        );

      console.log(
        "CREATE RESPONSE:",
        response.data,
      );

      if (
        response.data?.success
      ) {
        alert(
          "Customer delivery saved successfully",
        );

        onSave?.(
          response.data,
        );

        modal.reset();

        onClose();

        return;
      }

      alert(
        response.data?.error ||
          "Failed to save customer delivery",
      );
    } catch (error) {
      console.error(
        "Error saving delivery sheet:",
        error,
      );

      alert(
        "Failed to save customer delivery",
      );
    }
  };

  // ==========================================
  // CLOSE
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

            {/* ==================================
                HEADER
            ================================== */}

            <div className="modal-header">
              <h5 className="modal-title text-white">
                {editDeliverySheet
                  ? "Edit Customer Delivery Order"
                  : "Customer Delivery Order"}
              </h5>

              <button
                className="btn-close btn-close-white"
                onClick={handleClose}
              />
            </div>

            {/* ==================================
                BODY
            ================================== */}

            <div className="modal-body text-start">

              {/* ==================================
                  DELIVERY ORDER DETAILS
              ================================== */}

              <div className="row mb-2">

                {/* ==================================
                    LEFT
                ================================== */}

                <div className="col-md-6 border p-2">
                  <h6>
                    Delivery Order Details
                  </h6>

                  {/* DATE */}

                  <div className="mt-2">
                    <label>
                      Date
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={
                        modal.deliveryDate
                      }
                      onChange={(e) =>
                        modal.setDeliveryDate(
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  {/* CUSTOMER */}

                  <div className="mt-2">
                    <label>
                      Customer Name
                    </label>

                    <select
                      className="form-select"
                      value={
                        modal.selectedCustomerId
                      }
                      onChange={(e) =>
                        modal.setSelectedCustomerId(
                          e.target.value,
                        )
                      }
                      disabled={
                        modal.loadingCustomers ||
                        !!editDeliverySheet
                      }
                    >
                      <option value="">
                        {modal.loadingCustomers
                          ? "Loading Customers..."
                          : "-- Select Customer --"}
                      </option>

                      {modal.customers.map(
                        (customer) => (
                          <option
                            key={
                              customer.customerNumber
                            }
                            value={
                              customer.customerNumber
                            }
                          >
                            {
                              customer.customerName
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* SERVICE TYPE */}

                  <div className="mt-2">
                    <label>
                      Service Type
                    </label>

                    <select
                      className="form-select"
                      value={
                        modal.serviceType
                      }
                      onChange={(e) =>
                        modal.setServiceType(
                          e.target.value,
                        )
                      }
                      disabled={
                        modal.loadingServiceTypes ||
                        !!editDeliverySheet
                      }
                    >
                      <option value="">
                        {modal.loadingServiceTypes
                          ? "Loading Service Types..."
                          : "-- Select Service Type --"}
                      </option>

                      {modal.serviceTypes.map(
                        (service) => (
                          <option
                            key={
                              service.serviceTypeId
                            }
                            value={
                              service.serviceTypeId
                            }
                          >
                            {
                              service.serviceTypeName
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>

                {/* ==================================
                    RIGHT - DISPATCH TEAM
                ================================== */}

                <div className="col-md-6 border p-2">
                  <h6>
                    Dispatch Team
                  </h6>

                  {/* SALES REP */}

                  <div className="mt-2">
                    <label>
                      Sales Rep
                    </label>

                    <input
                      className="form-control"
                      value={
                        dispatchTeam.salesRep ??
                        ""
                      }
                      readOnly
                      placeholder="Auto-filled based on customer"
                    />
                  </div>

                  {/* ==================================
                      COURIER + REG
                  ================================== */}

                  <div className="row mt-2">

                    {/* COURIER SERVICE */}

                    <div className="col-md-6">
                      <label>
                        Courier Service
                      </label>

                      <select
                        className="form-select"
                        value={
                          modal.selectedCourierServiceId ??
                          ""
                        }
                        disabled={
                          modal.loadingCourierServices
                        }
                        onChange={(e) => {
                          const id =
                            e.target.value
                              ? Number(
                                  e.target.value,
                                )
                              : null;

                          console.log(
                            "Selected Courier Service:",
                            id,
                          );

                          modal.setSelectedCourierServiceId(
                            id,
                          );

                          const selectedCourier =
                            modal.courierServices.find(
                              (item) =>
                                Number(
                                  item.courierServiceId,
                                ) ===
                                Number(id),
                            );

                          console.log(
                            "Selected Courier:",
                            selectedCourier,
                          );

                          setDispatchTeam(
                            (prev) => ({
                              ...prev,

                              courierServiceId:
                                id ?? 0,

                              courierName:
                                selectedCourier?.courierName ??
                                "",

                              // Clear driver
                              driverId: 0,

                              driverName:
                                "",

                              driverIdNo:
                                "",
                            }),
                          );
                        }}
                      >
                        <option value="">
                          {modal.loadingCourierServices
                            ? "Loading Courier Services..."
                            : "-- Select Courier Service --"}
                        </option>

                        {modal.courierServices.map(
                          (courier) => (
                            <option
                              key={
                                courier.courierServiceId
                              }
                              value={
                                courier.courierServiceId
                              }
                            >
                              {
                                courier.courierName
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    {/* REG NO */}

                    <div className="col-md-6">
                      <label>
                        Reg No#
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          dispatchTeam.regNo ??
                          ""
                        }
                        onChange={(e) => {
                          setDispatchTeam(
                            (prev) => ({
                              ...prev,

                              regNo:
                                e.target.value,
                            }),
                          );
                        }}
                      />
                    </div>
                  </div>

                  {/* ==================================
                      DRIVER
                  ================================== */}

                  <div className="row mt-2">

                    {/* DRIVER NAME */}

                    <div className="col-md-6">
                      <label>
                        Driver Name
                      </label>

                      {isInternal ? (
                        <select
                          className="form-select"
                          value={
                            modal.selectedDriverId ??
                            ""
                          }
                          disabled={
                            !modal.selectedCourierServiceId ||
                            modal.loadingDrivers
                          }
                          onChange={(e) => {
                            const driverId =
                              e.target.value
                                ? Number(
                                    e.target.value,
                                  )
                                : null;

                            console.log(
                              "Selected Driver:",
                              driverId,
                            );

                            modal.handleDriverChange(
                              driverId,
                            );
                          }}
                        >
                          <option value="">
                            {modal.loadingDrivers
                              ? "Loading Drivers..."
                              : !modal.selectedCourierServiceId
                                ? "Select Courier Service First"
                                : "-- Select Driver --"}
                          </option>

                          {modal.drivers.map(
                            (driver) => (
                              <option
                                key={
                                  driver.driverId
                                }
                                value={
                                  driver.driverId
                                }
                              >
                                {
                                  driver.driverName
                                }
                              </option>
                            ),
                          )}
                        </select>
                      ) : (
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Driver Name"
                          value={
                            dispatchTeam.driverName ??
                            ""
                          }
                          onChange={(e) => {
                            setDispatchTeam(
                              (prev) => ({
                                ...prev,

                                driverName:
                                  e.target.value,
                              }),
                            );
                          }}
                        />
                      )}
                    </div>

                    {/* ID NO */}

                    <div className="col-md-6">
                      <label>
                        ID No#
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={
                          dispatchTeam.driverIdNo ??
                          ""
                        }
                        readOnly={
                          isInternal
                        }
                        placeholder={
                          isInternal
                            ? "Auto-filled from selected driver"
                            : "Enter Driver ID"
                        }
                        onChange={(e) => {
                          if (isInternal) {
                            return;
                          }

                          setDispatchTeam(
                            (prev) => ({
                              ...prev,

                              driverIdNo:
                                e.target.value,
                            }),
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================
                  CASING TABLES
              ================================== */}

              <div className="row mt-2">

                {/* ==================================
                    LEFT TABLE
                ================================== */}

                <div className="col-md-6 border p-2">
                  <h6>
                    Customer Casing Orders
                  </h6>

                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr className="bg-new">
                        <th>
                          Batch No
                        </th>

                        <th>
                          Production No
                        </th>

                        <th>
                          Tyre Size
                        </th>

                        <th>
                          +
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {modal.availableCasings
                        .length > 0 ? (
                        modal.availableCasings.map(
                          (
                            item: CustomerCasing,
                          ) => (
                            <tr
                              key={
                                item.orderCasingId
                              }
                            >
                              <td>
                                {
                                  item.batchNo
                                }
                              </td>

                              <td>
                                {
                                  item.productionNo
                                }
                              </td>

                              <td>
                                {
                                  item.tyreSize
                                }
                              </td>

                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() =>
                                    modal.handleAddCasing(
                                      item,
                                    )
                                  }
                                >
                                  +
                                </button>
                              </td>
                            </tr>
                          ),
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center text-muted"
                          >
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
                    RIGHT TABLE
                ================================== */}

                <div className="col-md-6">
                  <div className="border p-2">
                    <h6>
                      Repaired & Retreaded Casings (
                      {
                        modal
                          .selectedCasings
                          .length
                      }
                      )
                    </h6>

                    <table className="table table-sm table-bordered">
                      <thead>
                        <tr className="bg-new">
                          <th>
                            Service
                          </th>

                          <th>
                            Batch No
                          </th>

                          <th>
                            Production No
                          </th>

                          <th>
                            Tyre Size
                          </th>

                          <th>
                            Tyre Make
                          </th>

                          <th>
                            -
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {modal.selectedCasings
                          .length > 0 ? (
                          modal.selectedCasings.map(
                            (
                              item: CustomerCasing,
                            ) => (
                              <tr
                                key={
                                  item.orderCasingId
                                }
                              >
                                <td>
                                  {
                                    item.service
                                  }
                                </td>

                                <td>
                                  {
                                    item.batchNo
                                  }
                                </td>

                                <td>
                                  {
                                    item.productionNo
                                  }
                                </td>

                                <td>
                                  {
                                    item.tyreSize
                                  }
                                </td>

                                <td>
                                  {
                                    item.tyreMake
                                  }
                                </td>

                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() =>
                                      modal.handleRemoveCasing(
                                        item,
                                      )
                                    }
                                  >
                                    -
                                  </button>
                                </td>
                              </tr>
                            ),
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={6}
                              className="text-center text-muted"
                            >
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
                  FOOTER
              ================================== */}

              <div className="d-flex justify-content-between mt-3">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={
                    handleClose
                  }
                >
                  ← Close
                </button>

                <button
                  type="button"
                  className="btn btn-success px-4"
                  onClick={
                    handleSave
                  }
                  disabled={
                    modal.loadingCustomers ||
                    modal.loadingServiceTypes ||
                    modal.loadingBatchCasings
                  }
                >
                  {editDeliverySheet
                    ? "✔ Update Customer Delivery"
                    : "✔ Save Customer Delivery"}
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