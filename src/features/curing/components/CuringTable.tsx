import type { CuringRow } from "../type/curing.types";

interface Props {
  data: CuringRow[];

  selectedRows: number[];

  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
}

const CuringTable = ({ data, selectedRows, setSelectedRows }: Props) => {
  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-danger">
          <tr>
            <th></th>

            <th>SL No</th>

            <th>Production No</th>

            <th>Date</th>

            <th>Batch No</th>

            <th>Tyre Ref No</th>

            <th>Pattern</th>

            <th>Service</th>

            <th>Pipe No</th>

            <th>Comment</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) &&
            data.map((item, index) => (
              <tr key={item.orderCasingId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.orderCasingId)}
                    onChange={() => toggleRow(item.orderCasingId)}
                  />
                </td>

                <td>{index + 1}</td>

                <td>{item.productionNumber}</td>

                <td>{new Date(item.orderDate).toLocaleDateString()}</td>

                <td>{item.batchNumber}</td>

                <td>{item.tyreReferenceNumber}</td>

                <td>{item.patternName}</td>

                <td>{item.serviceTypeName}</td>

                <td>{item.autoclavePipeName ?? "-"}</td>

                <td>{item.comment ?? "-"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CuringTable;
