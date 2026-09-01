import useDispatchTeamModal from "../hooks/useDispatchTeamModal";
import { useState } from "react";
import type { DispatchTeam } from "../type/dispatch.types";

interface Props {
  show: boolean;

  onClose: () => void;

  onContinue: () => void;
  setDispatchTeam: React.Dispatch<React.SetStateAction<DispatchTeam>>;
  setIsInternal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DispatchTeamModal = ({
  show,
  onClose,
  onContinue,
  setDispatchTeam,
  setIsInternal,
}: Props) => {
  const modal = useDispatchTeamModal();

  // const [
  //     showCustomerModal,
  //     setShowCustomerModal,
  // ] = useState(false);

  // const [
  //     dispatchTeam,
  //     setDispatchTeam,
  // ] = useState({
  //     salesRep: "",
  //     courierName: "",
  //     regNo: "",
  //     driverName: "",
  //     driverId: "",
  // });

  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}

            <div className="modal-header text-white">
              <h5 className="modal-title text-white">Dispatch Team</h5>

              <button
                className="btn-close btn-close-white"
                onClick={() => {
                  modal.reset();

                  onClose();
                }}
              />
            </div>

            {/* BODY */}

            <div className="modal-body">
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      modal.activeTab === "add" ? "active" : ""
                    }`}
                    onClick={() => modal.setActiveTab("add")}
                  >
                    Add Courier
                  </button>
                </li>

                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      modal.activeTab === "select" ? "active" : ""
                    }`}
                    onClick={() => modal.setActiveTab("select")}
                  >
                    Select Courier
                  </button>
                </li>
              </ul>

              {/* ADD COURIER */}

              {/* ADD COURIER */}

              {modal.activeTab === "add" && (
                <>
                  <div className="row">
                    {/* COURIER SERVICE */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Courier Service</label>

                      <select
                        className="form-select"
                        value={modal.addCourierId ?? ""}
                        onChange={(e) => {
                          const id = e.target.value
                            ? Number(e.target.value)
                            : null;

                          modal.handleAddCourierServiceChange(id);
                        }}
                        disabled={modal.loadingCourierServices}
                      >
                        <option value="">
                          {modal.loadingCourierServices
                            ? "Loading..."
                            : "Select Courier Service"}
                        </option>

                        {modal.courierList.map((courier) => (
                          <option
                            key={courier.courierServiceId}
                            value={courier.courierServiceId}
                          >
                            {courier.courierName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* VEHICLE REG NO */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Vehicle Reg No</label>

                      <select
                        className="form-select"
                        value={modal.addSelectedVehicle?.courierVehicleId ?? ""}
                        disabled={
                          !modal.addCourierId || modal.loadingAddVehicles
                        }
                        onChange={(e) => {
                          const vehicleId = e.target.value
                            ? Number(e.target.value)
                            : null;

                          const vehicle =
                            modal.addVehicleList.find(
                              (item) => item.courierVehicleId === vehicleId,
                            ) ?? null;

                          modal.setAddSelectedVehicle(vehicle);
                        }}
                      >
                        <option value="">
                          {modal.loadingAddVehicles
                            ? "Loading..."
                            : modal.addCourierId
                              ? "Select Vehicle Reg No"
                              : "Select Courier Service First"}
                        </option>

                        {modal.addVehicleList.map((vehicle) => (
                          <option
                            key={vehicle.courierVehicleId}
                            value={vehicle.courierVehicleId}
                          >
                            {vehicle.vehicleRegNo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    {/* DRIVER NAME */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Driver Name</label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Driver Name"
                        value={modal.driverName}
                        onChange={(e) => modal.setDriverName(e.target.value)}
                      />
                    </div>

                    {/* DRIVER ID */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Driver ID</label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Driver ID"
                        value={modal.driverId}
                        onChange={(e) => modal.setDriverId(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ADD COURIER BUTTON */}
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={
                        modal.savingCourier ||
                        !modal.addCourierId ||
                        !modal.addSelectedVehicle ||
                        !modal.driverName.trim() ||
                        !modal.driverId.trim()
                      }
                      onClick={async () => {
                        const success = await modal.addCourier();

                        if (success) {
                          console.log("Courier added successfully");
                        }
                      }}
                    >
                      {modal.savingCourier ? "Adding..." : "ADD COURIER"}
                    </button>
                  </div>
                </>
              )}
              {/* SELECT COURIER */}

              {modal.activeTab === "select" && (
                <>
                  {/* COURIER TYPE */}

                  <div className="mb-3">
                    <label className="form-label">Courier Type</label>

                    <select
                      className="form-select"
                      value={modal.courierType}
                      onChange={(e) => {
                        const value = e.target.value;

                        modal.setCourierType(value);

                        // Clear previous external selection
                        if (value === "Internal") {
                          modal.setSelectedCourierId(null);

                          modal.setVehicleList([]);

                          modal.setSelectedVehicle(null);
                        }
                      }}
                    >
                      <option value="">Select Type</option>

                      <option value="Internal">Internal</option>

                      <option value="External">External</option>
                    </select>
                  </div>

                  {/* EXTERNAL ONLY */}

                  {modal.courierType === "External" && (
                    <>
                      {/* COURIER SERVICE */}

                      <div className="col mb-3">
                        <label className="form-label">Courier Service</label>

                        <select
                          className="form-select"
                          value={modal.selectedCourierId ?? ""}
                          onChange={(e) => {
                            const id = e.target.value
                              ? Number(e.target.value)
                              : null;

                            modal.handleCourierServiceChange(id);
                          }}
                          disabled={modal.loadingCourierServices}
                        >
                          <option value="">
                            {modal.loadingCourierServices
                              ? "Loading..."
                              : "Select Courier Service"}
                          </option>

                          {modal.courierList.map((courier) => (
                            <option
                              key={courier.courierServiceId}
                              value={courier.courierServiceId}
                            >
                              {courier.courierName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* VEHICLE TABLE */}

                      {modal.selectedCourierId && (
                        <>
                          {modal.loadingVehicles ? (
                            <div className="text-center p-3">
                              Loading vehicles...
                            </div>
                          ) : (
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>✔</th>
                                  <th>Courier</th>
                                  <th>Reg No</th>
                                  <th>Driver</th>
                                </tr>
                              </thead>

                              <tbody>
                                {modal.vehicleList.length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="text-center">
                                      No vehicles found
                                    </td>
                                  </tr>
                                ) : (
                                  modal.vehicleList.map((vehicle) => {
                                    const courier = modal.courierList.find(
                                      (c) =>
                                        c.courierServiceId ===
                                        vehicle.courierServiceId,
                                    );

                                    return (
                                      <tr key={vehicle.courierVehicleId}>
                                        <td>
                                          <input
                                            type="radio"
                                            name="selectedCourierVehicle"
                                            checked={
                                              modal.selectedVehicle
                                                ?.courierVehicleId ===
                                              vehicle.courierVehicleId
                                            }
                                            onChange={() =>
                                              modal.setSelectedVehicle(vehicle)
                                            }
                                          />
                                        </td>

                                        <td>{courier?.courierName}</td>

                                        <td>{vehicle.vehicleRegNo}</td>

                                        <td>{vehicle.driverName}</td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* CONTINUE */}

                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={
                        !modal.courierType ||
                        (modal.courierType === "External" &&
                          !modal.selectedVehicle)
                      }
                      onClick={() => {
                        // ==========================================
                        // INTERNAL
                        // ==========================================

                        if (modal.courierType === "Internal") {
                          setDispatchTeam({
                            salesRep: "",
                            courierName: "",
                            courierServiceId: 0,
                            regNo: "",
                            driverName: "",
                            driverId: "",
                          });

                          setIsInternal(true);

                          modal.reset();

                          onContinue();

                          return;
                        }

                        // ==========================================
                        // EXTERNAL
                        // ==========================================

                        const selected = modal.selectedVehicle;

                        if (!selected) {
                          alert("Please select a vehicle");
                          return;
                        }

                        const courier = modal.courierList.find(
                          (c) =>
                            c.courierServiceId === selected.courierServiceId,
                        );

                        const newDispatchTeam = {
                          salesRep: "",

                          courierName: courier?.courierName ?? "",

                          courierServiceId: selected.courierServiceId,

                          regNo: selected.vehicleRegNo ?? "",

                          driverName: selected.driverName ?? "",

                          driverId: selected.driverIdNo ?? "",
                        };

                        console.log("========== SELECTED VEHICLE ==========");

                        console.log("Selected Vehicle:", selected);

                        console.log("Courier:", courier);

                        console.log("Dispatch Team:", newDispatchTeam);

                        // ==========================================
                        // SEND DATA TO CUSTOMER DELIVERY MODAL
                        // ==========================================

                        setDispatchTeam(newDispatchTeam);

                        setIsInternal(false);

                        modal.reset();

                        onContinue();
                      }}
                    >
                      Continue to Dispatch →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default DispatchTeamModal;
