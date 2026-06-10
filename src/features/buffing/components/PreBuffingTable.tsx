
import type{ PreBuffingRow } from "../types/preBuffingTypes";
import buffingStageServiceApi from "../service/buffingStageServiceApi";

interface Props {
  data: PreBuffingRow[];
  onApprove: (item: PreBuffingRow) => void;
}

const PreBuffingTable = ({ data, onApprove }: Props) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">

        <thead className="table-light">
          <tr>
            <th>Production No</th>
            <th>Serial No</th>
            <th>Customer</th>
            <th>Tyre Size</th>
            <th>Make</th>
            <th>Model</th>
            <th>Pattern</th>
            <th>Width</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="text-center"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id}>

                <td>{item.casing}</td>

                <td>{item.serial}</td>

                <td>
                  {item.customerName}
                </td>

                <td>{item.tyreSize}</td>

                <td>{item.tyreMake}</td>

                <td>{item.model}</td>

                <td>
                  {item.requestedPattern}
                </td>

                <td>{item.width}</td>

                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      onApprove(item)
                    }
                  >
                    Inspect
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
};

export default PreBuffingTable;