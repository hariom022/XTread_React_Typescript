import type { Machine } from "../types/machine.types";
import { getCasingStageName } from "../constants/casingStages";

interface MachineTableProps {
  machines: Machine[];
}

const MachineTable = ({ machines }: MachineTableProps) => {
  return (
    <div className="machine-table-wrapper">
      <table className="table machine-table mb-0">
        <thead>
          <tr>
            <th>ID</th>

            <th>Machine Name</th>

            <th>Casing Stage</th>

            <th>Sort Order</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {machines.length === 0 ? (
            <tr>
              <td colSpan={4} className="machine-empty-state">
                No Records Found
              </td>
            </tr>
          ) : (
            machines.map((item) => (
              <tr key={item.machineId}>
                {/* ID */}
                <td>
                  <span className="machine-id">{item.machineId}</span>
                </td>

                {/* MACHINE NAME */}
                <td>
                  <span className="machine-name">{item.machineName}</span>
                </td>

                {/* CASING STAGE */}
                <td>
                  <span className="rejection-stage-badge">
                    {getCasingStageName(item.casingStageId)}
                  </span>
                </td>

                {/* SORT ORDER */}
                <td>
                  <span className="machine-sort-order">{item.sortOrder}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MachineTable;
