import type { Autoclave } from "../types/autoclave.types";

interface AutoclaveTableProps {
  autoclaves: Autoclave[];
}

const AutoclaveTable = ({
  autoclaves,
}: AutoclaveTableProps) => {
  return (
    <div className="autoclave-table-wrapper">
      <table className="table autoclave-table mb-0">
        <thead>
          <tr>
            <th>
              ID
            </th>

            <th>Autoclave Name</th>

            <th>Sort Order</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {autoclaves.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="autoclave-empty-state"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            autoclaves.map((item) => (
              <tr key={item.autoclaveId}>

                {/* ID */}
                <td>
                  <span className="autoclave-id">
                    {item.autoclaveId}
                  </span>
                </td>

                {/* NAME */}
                <td>
                  <span className="autoclave-name">
                    {item.name}
                  </span>
                </td>

                {/* SORT ORDER */}
                <td>
                  <span className="autoclave-sort-order">
                    {item.sortOrder}
                  </span>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AutoclaveTable;