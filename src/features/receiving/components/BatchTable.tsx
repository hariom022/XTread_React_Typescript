import type { ReceivingRow } from "../types/receiving.types";

type Props = {
  data: ReceivingRow[];

  selectedCasingRows: string[];

  toggleCasingRow: (
    id: number
  ) => void;

  toggleAllCasing: () => void;

  onCreateBatch: () => void;
};

const BatchTable = ({
  data,
  selectedCasingRows,
  toggleCasingRow,
  toggleAllCasing,
  onCreateBatch,
}: Props) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            <th style={{ width: "40px" }}>
              <input
                type="checkbox"
                onChange={toggleAllCasing}
                checked={
                  data.length > 0 &&
                  selectedCasingRows.length ===
                    data.length
                }
              />
            </th>

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
            <th>Comment</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={12}
                className="text-center"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCasingRows.includes(
                      String(item.id)
                    )}
                    onChange={() =>
                      toggleCasingRow(item.id)
                    }
                  />
                </td>

                <td>{item.date}</td>

                <td>
                  {item.productionNo}
                </td>

                <td>
                  {
                    item.tyreReferenceNumber
                  }
                </td>

                <td>{item.otherNumber}</td>

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
                  {item.comments || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-end">
        <button
          className="btn btn-danger btn m-2"
          onClick={onCreateBatch}
        >
          <b>Create Production Batch</b>
        </button>
      </div>
    </div>
  );
};

export default BatchTable;