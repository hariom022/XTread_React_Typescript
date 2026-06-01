import React from "react";

import type { ReceivingRow } from "../types/receiving.types";

type Props = {
  groupedBatches: Record<string, ReceivingRow[]>;

  expandedBatch: string | null;

  selectedBatches: string[];

  toggleBatch: (batchNo: string) => void;

  toggleBatchSelection: (batchNo: string) => void;

  onProceed: () => void;
};

const BarcodeTable = ({
  groupedBatches,
  expandedBatch,
  selectedBatches,
  toggleBatch,
  toggleBatchSelection,
  onProceed,
}: Props) => {
  const batchEntries = Object.entries(groupedBatches);

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th style={{ width: "40px" }}></th>
            <th style={{ width: "40px" }}></th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Batch No</th>
            <th>Total Casings</th>
          </tr>
        </thead>

        <tbody>
          {batchEntries.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center">
                No Data Available
              </td>
            </tr>
          ) : (
            batchEntries.map(([batchNo, items]) => (
              <React.Fragment key={batchNo}>
                {/* Parent Row */}
                <tr
                  style={{
                    background: "#f8f9fa",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleBatch(batchNo)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batchNo)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() =>
                        toggleBatchSelection(batchNo)
                      }
                    />
                  </td>

                  <td>
                    {expandedBatch === batchNo
                      ? "▼"
                      : "▶"}
                  </td>

                  <td>{items[0]?.date || "-"}</td>

                  <td>
                    {items[0]?.customerName || "-"}
                  </td>

                  <td>
                    <b>{batchNo}</b>
                  </td>

                  <td>{items.length}</td>
                </tr>

                {/* Child Table */}
                {expandedBatch === batchNo && (
                  <tr>
                    <td colSpan={6}>
                      <table className="table table-sm table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Date</th>
                            <th>Production No</th>
                            <th>Tyre Ref No</th>
                            <th>Other No</th>
                            <th>DOT No</th>
                            <th>Is Retreaded</th>
                            <th>Tyre Size</th>
                            <th>Make</th>
                            <th>Pattern</th>
                            <th>Service Type</th>
                            <th>Barcode</th>
                          </tr>
                        </thead>

                        <tbody>
                          {items.map((item) => (
                            <tr key={item.id}>
                              <td>{item.date}</td>

                              <td>
                                {item.productionNo || "-"}
                              </td>

                              <td>
                                {item.tyreReferenceNumber}
                              </td>

                              <td>
                                {item.otherNumber}
                              </td>

                              <td>{item.dotNo}</td>

                              <td>
                                {Number(
                                  item.numberOfRetreads
                                ) > 0
                                  ? "Yes"
                                  : "No"}
                              </td>

                              <td>
                                {item.casingSize}
                              </td>

                              <td>{item.make}</td>

                              <td>
                                {item.treadPattern}
                              </td>

                              <td>
                                {item.serviceType}
                              </td>

                              <td>
                                <b>
                                  {item.barcodeNumber ||
                                    "-"}
                                </b>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-end mt-3 me-1 mb-2">
        <button
          className="btn btn-danger btn-sm"
          onClick={onProceed}
          disabled={selectedBatches.length === 0}
        >
          Proceed To Next Stage
        </button>
      </div>
    </div>
  );
};

export default BarcodeTable;