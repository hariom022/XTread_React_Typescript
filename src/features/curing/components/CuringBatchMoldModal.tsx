import { useMemo, useState, useEffect } from "react";

import type {
  CuringRow,
  AllocatedPipeRow,
  AutoclavePipe,
} from "../type/curing.types";
import curingServiceApi from "../service/curingServiceApi";

interface Props {
  show: boolean;

  selectedmold: number | "";

  availableRows: CuringRow[];

  allocatedRows: AllocatedPipeRow[];

  selectedAllocatedRow: AllocatedPipeRow | null;

  setSelectedAllocatedRow: React.Dispatch<
    React.SetStateAction<AllocatedPipeRow | null>
  >;

  removeFromPipe: () => void;

  loadCuring: () => void;
  loadMoldCuring: (rows: CuringRow[], moldId: number) => void;
  onClose: () => void;
}

const CuringBatchMoldModal = ({
  show,

  selectedmold,

  availableRows,

  allocatedRows,

  selectedAllocatedRow,

  setSelectedAllocatedRow,

  removeFromPipe,

  loadCuring,
  loadMoldCuring,
  onClose,
}: Props) => {
  if (!show) return null;

  const [moldName, setMoldName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMoldRows, setSelectedMoldRows] = useState<CuringRow[]>([]);
  useEffect(() => {
    const fetchPipes = async () => {
      try {
        if (!selectedmold) return;

        const moldResponse = await curingServiceApi.loadMold();

        const selected = moldResponse.data.data?.find(
          (x: any) => x.moldId === Number(selectedmold),
        );

        setMoldName(selected?.name || "");
      } catch (error) {
        console.error(error);
      }
    };

    fetchPipes();
  }, [selectedmold]);

  const filteredAvailableRows = availableRows.filter(
    (item) =>
      item.productionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tyreReferenceNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );
  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            {/* HEADER */}

            <div className="modal-header bg-danger text-white">
              <h4 className="modal-title">CURING BATCH</h4>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            {/* BODY */}

            <div className="modal-body">
              <div
                className="d-flex justify-content-between align-items-center mb-3 px-3 py-2 rounded"
                style={{
                  backgroundColor: "#e9f2ff",
                }}
              >
                <h5 className="fw-bold mb-0">Auto Clave - Casing Allocation</h5>

                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold">Staff Name</span>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    style={{ width: "180px" }}
                    value="John"
                    readOnly
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <b>{moldName}</b>
                </div>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search Production No"
                  style={{ width: "250px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* TABLE 1 */}

              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Checkbox</th>
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
                  {filteredAvailableRows.map((item) => {
                    const isSelected = selectedMoldRows.some(
                      (x) => x.orderCasingId === item.orderCasingId,
                    );

                    return (
                      <tr key={item.orderCasingId}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMoldRows((prev) => [...prev, item]);
                              } else {
                                setSelectedMoldRows((prev) =>
                                  prev.filter(
                                    (x) =>
                                      x.orderCasingId !== item.orderCasingId,
                                  ),
                                );
                              }
                            }}
                          />
                        </td>

                        <td>{item.productionNumber}</td>

                        <td>{new Date(item.orderDate).toLocaleDateString()}</td>

                        <td>{item.batchNumber}</td>

                        <td>{item.tyreReferenceNumber}</td>

                        <td>-</td>

                        <td>-</td>

                        <td>{item.tyreSizeLabel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* TABLE 2 */}

              <h6 className="fw-bold mt-4"> Allocated Casings </h6>
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Checkbox</th>

                    <th>Production Number</th>

                    <th>Date</th>

                    <th>Batch Number</th>

                    <th>Tyre Ref Number</th>

                    <th>Available @ Station / Batch</th>

                    <th>TimeSinceBuilding</th>

                    {/* <th>Chamber</th> */}

                    <th>Mounting Size</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedMoldRows.map((item) => (
                    <tr key={item.orderCasingId}>
                      <td>
                        <input
                          type="checkbox"
                          checked={true}
                          onChange={() => {
                            setSelectedMoldRows((prev) =>
                              prev.filter(
                                (x) => x.orderCasingId !== item.orderCasingId,
                              ),
                            );
                          }}
                        />
                      </td>

                      <td>{item.productionNumber}</td>

                      <td>{new Date(item.orderDate).toLocaleDateString()}</td>

                      <td>{item.batchNumber}</td>

                      <td>{item.tyreReferenceNumber}</td>

                      <td>-</td>

                      <td>-</td>

                      {/* <td>{item.chamber}</td> */}

                      <td>{item.tyreSizeLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end">
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    setSelectedMoldRows([]);
                  }}
                >
                  Remove Selected
                </button>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button
                className="btn btn-success"
                onClick={() => {
                  if (selectedMoldRows.length === 0) {
                    alert("Please select at least one casing.");
                    return;
                  }

                  if (!selectedmold) {
                    alert("Mold is not selected.");
                    return;
                  }

                  loadMoldCuring(selectedMoldRows, Number(selectedmold));
                }}
              >
                Load Curing
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default CuringBatchMoldModal;
