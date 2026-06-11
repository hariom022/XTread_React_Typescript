import type { RefObject } from "react";

import "../style/skivingStage.css";
import type {
  InspectionRepair,
  SkivingRepair,
  SkivingStage1Row,
} from "../types/skivingStage1.types";

interface Machine {
  machineId: number;
  machineName: string;
}
interface DamageType {
  id: number;
  name: string;
}
interface RepairLocation {
  id: number;
  name: string;
}
type Repair = SkivingRepair;

interface Props {
  modalRef: RefObject<HTMLDivElement | null>;

  selectedItem: SkivingStage1Row | null;

  machines: Machine[];
  damageTypes: DamageType[];
  repairLocations: RepairLocation[];
  skivingStation: string;
  setSkivingStation: React.Dispatch<
    React.SetStateAction<string>
  >;

  remarks: string;
  setRemarks: React.Dispatch<
    React.SetStateAction<string>
  >;

  inspectionData: InspectionRepair[];

  skivingRepairs: Repair[];

  newRepair: Repair;

  setNewRepair: React.Dispatch<
    React.SetStateAction<Repair>
  >;
  setSkivingRepairs: React.Dispatch<
    React.SetStateAction<Repair[]>
  >;
  addRepair: () => void;

  removeRepair: (index: number) => void;

  handleSave: () => void;

  resetModal: () => void;
}

const SkivingStage1Modal = ({
  modalRef,
  selectedItem,

  machines,
  damageTypes,
  repairLocations,
  skivingStation,
  setSkivingStation,

  remarks,
  setRemarks,

  inspectionData,

  skivingRepairs,

  newRepair,
  setNewRepair,

  addRepair,
  removeRepair,

  handleSave,
  resetModal,
}: Props) => {
  return (
    <div
      className="modal fade"
      ref={modalRef}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content">

          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              SKIVING STAGE 1 - APPROVAL
            </h5>

            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              onClick={resetModal}
            />
          </div>

          <div className="modal-body">

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
                  <div>{selectedItem?.customerName}</div>
                </div>

                <div className="col">
                  <strong>Tyre Size</strong>
                  <div>{selectedItem?.tyreSize}</div>
                </div>

                <div className="col">
                  <strong>Requested Pattern</strong>
                  <div>
                    {selectedItem?.requestedPattern}
                  </div>
                </div>

                <div className="col">
                  <strong>ReApproved Pattern</strong>
                  <div>
                    {selectedItem?.reApprovedPattern || "-"}
                  </div>
                </div>

              </div>
            </div>

            {/* Station */}
            <div className="col box p-2 mb-3">
              <div className="row">

                <div className="col-md-3">

                  <label className="fw-semibold mb-1 d-block">
                    <b> Damage Level</b>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={
                      selectedItem?.damageLevel || ""
                    }
                    readOnly
                  />

                </div>

                <div className="col-md-3">

                  <label className="fw-semibold mb-1 d-block">
                    <b>Skiving Station</b>
                  </label>

                  <select
                    className="form-select"
                    value={skivingStation}
                    onChange={(e) =>
                      setSkivingStation(
                        e.target.value,
                      )
                    }
                  >
                    <option value="">
                      Select Station
                    </option>

                    {machines.map(
                      (machine) => (
                        <option
                          key={
                            machine.machineId
                          }
                          value={
                            machine.machineId
                          }
                        >
                          {
                            machine.machineName
                          }
                        </option>
                      ),
                    )}
                  </select>

                </div>

                <div className="col-md-6">

                  <label className="fw-semibold mb-1 d-block">
                    <b>Remark</b>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={remarks}
                    onChange={(e) =>
                      setRemarks(
                        e.target.value,
                      )
                    }
                  />

                </div>

              </div>
            </div>

            <div className="row">

              {/* Inspection */}

              <div className="col-md-6">
                <div className="box h-100">
                  <h5>
                    Inspection Stage - Patches
                  </h5>
                  <div className="px-2">

                    <div className="table-responsive">
                      <table className="table table-bordered align-middle">

                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Location</th>
                            <th>FoundAtLocation</th>
                          </tr>
                        </thead>

                        <tbody>
                          {inspectionData.map(
                            (
                              item,
                              index,
                            ) => (
                              <tr key={index}>
                                <td>
                                  {
                                    item.type
                                  }
                                </td>
                                <td>
                                  {item.location}
                                </td>
                                <td>
                                  {item.foundAt}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skiving */}

              <div className="col-md-6">
                <div className="box h-100">
                  <h5>
                    Skiving Stage Data
                  </h5>

                  <div className="row mb-2">

                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={newRepair.type}
                        onChange={(e) =>
                          setNewRepair(
                            (prev) => ({
                              ...prev,
                              type: e.target.value,
                            }),
                          )
                        }
                      >
                        <option value="" selected disabled>
                          Damage Type
                        </option>

                        {damageTypes.map((item) => (
                          <option
                            key={item.id}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>

                    </div>

                    <div className="col-md-4">

                      <select
                        className="form-select"
                        value={newRepair.location}
                        onChange={(e) =>
                          setNewRepair(
                            (prev) => ({
                              ...prev,
                              location: e.target.value,
                            }),
                          )
                        }
                      >
                        <option value="" selected disabled>
                          Repair Location
                        </option>

                        {repairLocations.map((item) => (
                          <option
                            key={item.id}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4 p-1">

                      <button
                        className="btn btn-danger"
                        onClick={
                          addRepair
                        }
                      >
                        + Add Repair
                      </button>

                    </div>

                  </div>

                  <table className="table table-bordered">

                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {skivingRepairs.map(
                        (
                          item,
                          index,
                        ) => (
                          <tr key={index}>
                            <td>
                              {item.type}
                            </td>

                            <td>
                              {
                                item.location
                              }
                            </td>

                            <td>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  removeRepair(
                                    index,
                                  )
                                }
                              >
                                Delete
                              </button>

                            </td>
                          </tr>
                        ),
                      )}

                    </tbody>

                  </table>
                </div>
              </div>

            </div>

            <div className="text-end mt-3">

              <button
                className="btn btn-success"
                onClick={handleSave}
              >
                SAVE
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SkivingStage1Modal;