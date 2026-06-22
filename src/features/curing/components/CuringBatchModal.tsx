import { useMemo, useState, useEffect } from "react";

import type {
  CuringRow,
  AllocatedPipeRow,
  AutoclavePipe,
} from "../type/curing.types";
import curingServiceApi from "../service/curingServiceApi";

interface Props {
  show: boolean;

  selectedAutoclave: number | "";

  availableRows: CuringRow[];

  allocatedRows: AllocatedPipeRow[];

  selectedAllocatedRow: AllocatedPipeRow | null;

  setSelectedAllocatedRow: React.Dispatch<
    React.SetStateAction<AllocatedPipeRow | null>
  >;

  allocatePipe: (row: CuringRow, pipeNo: number, pipeName: string,autoclavePipeId: number) => void;

  removeFromPipe: () => void;

  loadCuring: () => void;

  onClose: () => void;
}

const CuringBatchModal = ({
  show,

  selectedAutoclave,

  availableRows,

  allocatedRows,

  selectedAllocatedRow,

  setSelectedAllocatedRow,

  allocatePipe,

  removeFromPipe,

  loadCuring,

  onClose,
}: Props) => {
  if (!show) return null;

  const usedPipeNumbers = allocatedRows.map((x) => x.pipeNo);

  const [pipes, setPipes] = useState<AutoclavePipe[]>([]);
  const [autoclaveName, setAutoclaveName] = useState("");
  useEffect(() => {
    const fetchPipes = async () => {
      try {
        if (!selectedAutoclave) return;

        const autoclavesResponse = await curingServiceApi.loadAutoClaves();

        const selected = autoclavesResponse.data.data?.find(
          (x: any) => x.autoclaveId === Number(selectedAutoclave),
        );

        setAutoclaveName(selected?.name || "");

        const pipesResponse = await curingServiceApi.loadAutoClavePipes(
          Number(selectedAutoclave),
        );

        setPipes(pipesResponse.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPipes();
  }, [selectedAutoclave]);
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
                <h5 className="fw-bold">Auto Clave Allocation</h5>

                <div>
                <b>{autoclaveName}</b>
                </div>
              </div>

              {/* TABLE 1 */}

              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Production Number</th>

                    <th>Date</th>

                    <th>Batch Number</th>

                    <th>TyreRef Number</th>

                    <th>Available @ Station / Batch</th>

                    <th>TimeSinceBuilding</th>

                    <th>Pipe No</th>
                  </tr>
                </thead>

                <tbody>
                  {availableRows.map((item) => (
                    <tr key={item.orderCasingId}>
                      <td>{item.productionNumber}</td>

                      <td>{new Date(item.orderDate).toLocaleDateString()}</td>

                      <td>{item.batchNumber}</td>

                      <td>{item.tyreReferenceNumber}</td>

                      <td>-</td>

                      <td>-</td>

                      <td>
                        <select
                          className="form-select form-select-sm"
                          defaultValue=""
                          onChange={(e) => {
                            const selectedPipe = pipes.find(
                              (p) => p.pipeName === e.target.value,
                            );

                            if (!selectedPipe) return;

                            allocatePipe(
                              item,
                              Number(selectedPipe.pipeName),
                              selectedPipe.pipeName,
                              selectedPipe.autoclavePipeId
                            );
                          }}
                        >
                          <option value="">Select</option>

                          {pipes
                            .filter(
                              (pipe) =>
                                pipe.isActive &&
                                !usedPipeNumbers.includes(
                                  Number(pipe.pipeName),
                                ),
                            )
                            .map((pipe) => (
                              <option
                                key={pipe.autoclavePipeId}
                                value={pipe.pipeName}
                              >
                                {pipe.pipeName}
                              </option>
                            ))}
                        </select>
                      </td>
                    </tr>
                  ))}
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

                    <th>Pipe No</th>
                  </tr>
                </thead>

                <tbody>
                  {allocatedRows.map((item) => (
                    <tr key={item.orderCasingId}>
                      <td>
                        <input
                          type="checkbox"
                          checked={
                            selectedAllocatedRow?.orderCasingId ===
                            item.orderCasingId
                          }
                          onChange={() => setSelectedAllocatedRow(item)}
                        />
                      </td>

                      <td>{item.productionNumber}</td>

                      <td>{new Date(item.orderDate).toLocaleDateString()}</td>

                      <td>{item.batchNumber}</td>

                      <td>{item.tyreReferenceNumber}</td>

                      <td>-</td>

                      <td>-</td>

                      {/* <td>{item.chamber}</td> */}

                      <td>{item.pipeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end">
                <button className="btn btn-warning" onClick={removeFromPipe}>
                  Remove From Pipe
                </button>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button className="btn btn-success" onClick={loadCuring}>
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

export default CuringBatchModal;
