import type { MountingRow } from "../types/mounting.type";

interface Props {
  data: MountingRow[];

  selectedRows: number[];

  setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;
}

const MountingTable = ({
  data,
  selectedRows,
  setSelectedRows,
}: Props) => {
  console.log("Table Data", data);
  console.log(selectedRows);
  const toggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th></th>

            <th>SL No</th>

            <th>Production Number</th>

            <th>Date</th>

            <th>Batch Number</th>

            <th>Tyre Ref Number</th>

            <th>Pattern</th>

            <th>Service</th>

            <th>Mounting Size</th>

            {/* <th>Rail No</th> */}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
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

              <td>
                {/* {rails.find((r: Rail) => r.railId === item.railId)?.name ?? "-"} */}
                {item.mountingSize}
              </td>

             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MountingTable;
