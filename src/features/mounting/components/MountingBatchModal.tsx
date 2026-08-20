import { useMemo, useState } from "react";
import type { AllocatedMountingRow, MountingRow } from "../types/mounting.type";

interface Props {
  show: boolean;

  selectedMountingSizeId: number | null;

  availableRows: MountingRow[];

  allocatedRows: AllocatedMountingRow[];

  allocateMounting: (row: MountingRow) => void;

  removeFromMounting: (row: AllocatedMountingRow) => void;

  processMounting: () => void;

  onClose: () => void;
}

const MountingBatchModal = ({
  show,
  availableRows,
  allocatedRows,
  allocateMounting,
  removeFromMounting,
  processMounting,
  onClose,
}: Props) => {
  
  console.log("Allocated Rows", allocatedRows);
  const [searchTerm, setSearchTerm] = useState("");
  // const selectedMount = mountSize.find(
  //   (x) => x.mountSize === selectedMountSizeId
  // );
  const [selectedAllocatedRow, setSelectedAllocatedRow] =
    useState<AllocatedMountingRow | null>(null);

  const filteredRows = availableRows.filter(
    (item) =>
      item.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tyreReferenceNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );
  if (!show) return null;

  // Only one casing can be mounted at a time
  const hasAllocatedRow = allocatedRows.length > 0;

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}

            <div className="modal-header bg-danger text-white">
              <h4 className="modal-title">MOUNTING BATCH</h4>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            {/* BODY */}

            <div className="modal-body">
              {/* TOP HEADER */}

              <div
                className="d-flex justify-content-between align-items-center mb-3 px-3 py-2 rounded"
                style={{
                  backgroundColor: "#e9f2ff",
                }}
              >
                <h5 className="fw-bold mb-0">Mounting - Casing Allocation</h5>

                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold">Staff Name</span>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{
                      width: "180px",
                    }}
                    value="John"
                    readOnly
                  />
                </div>
              </div>

              {/* RAIL BADGE + SEARCH */}

              <div className="d-flex justify-content-between align-items-center mb-3">
                {/* <div>
                 {selectedMount && (
  <span className="rail-badge">
    <b>{selectedMount.name}</b>
  </span>
)}
                </div> */}

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Casing No / Serial No"
                  style={{
                    width: "250px",
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* AVAILABLE TABLE */}

              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th
                        style={{
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        Select
                      </th>
                      <th>Production Number</th>

                      <th>Date</th>

                      <th>Batch Number</th>

                      <th>TyreRef Number</th>

                      <th>Available @ Station / Batch</th>

                      <th>TimeSinceBuilding</th>

                      <th>Mounting Size</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted">
                          No casings available
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((item: MountingRow) => {
                        // Check if this particular item is already allocated
                        const isAllocated = allocatedRows.some(
                          (allocated) =>
                            allocated.orderCasingId === item.orderCasingId,
                        );

                        return (
                          <tr key={item.orderCasingId}>
                            {/* CHECKBOX */}
                            <td className="text-center">
                              <input
                                type="checkbox"
                                checked={isAllocated}
                                disabled={hasAllocatedRow && !isAllocated}
                                onChange={() => {
                                  if (!isAllocated) {
                                    allocateMounting(item);
                                  }
                                }}
                              />
                            </td>

                            <td>{item.productionNumber}</td>

                            <td>
                              {new Date(item.orderDate).toLocaleDateString()}
                            </td>

                            <td>{item.batchNumber}</td>

                            <td>{item.tyreReferenceNumber}</td>

                            <td>Building</td>

                            <td>--</td>

                            <td
                              style={{
                                width: "120px",
                              }}
                            >
                              {item.tyreSizeLabel}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* ALLOCATED TABLE */}

              <div className="mt-4">
                <h6 className="fw-bold">Mounted Casings</h6>

                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th
                        style={{
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        Select
                      </th>

                      <th>Production Number</th>

                      <th>Date</th>

                      <th>Batch Number</th>

                      <th>TyreRef Number</th>

                      <th>Available @ Station / Batch</th>

                      <th>TimeSinceBuilding</th>

                      <th>Mounting Size</th>
                    </tr>
                  </thead>

                  <tbody>
                    {allocatedRows.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted">
                          No casings allocated yet
                        </td>
                      </tr>
                    ) : (
                      allocatedRows.map((item: AllocatedMountingRow) => (
                        <tr key={item.orderCasingId}>
                          {/* SECOND TABLE CHECKBOX */}
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={
                                selectedAllocatedRow?.orderCasingId ===
                                item.orderCasingId
                              }
                              onChange={() => {
                                if (
                                  selectedAllocatedRow?.orderCasingId ===
                                  item.orderCasingId
                                ) {
                                  setSelectedAllocatedRow(null);
                                } else {
                                  setSelectedAllocatedRow(item);
                                }
                              }}
                            />
                          </td>

                          <td>{item.productionNumber}</td>

                          <td>
                            {new Date(item.orderDate).toLocaleDateString()}
                          </td>

                          <td>{item.batchNumber}</td>

                          <td>{item.tyreReferenceNumber}</td>

                          <td>Mounting</td>

                          <td>--</td>

                          <td>{item.mountingSize}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                <div className="text-end">
                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      if (selectedAllocatedRow) {
                        removeFromMounting(selectedAllocatedRow);

                        setSelectedAllocatedRow(null);
                      }
                    }}
                  >
                    Dismount
                  </button>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button className="btn btn-success" onClick={processMounting}>
                Confirm Mounting
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default MountingBatchModal;
