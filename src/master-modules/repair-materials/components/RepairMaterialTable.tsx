import type { RepairMaterial } from "../types/repairMaterial.types";

interface RepairMaterialTableProps {
  repairMaterials: RepairMaterial[];
}

const RepairMaterialTable = ({
  repairMaterials,
}: RepairMaterialTableProps) => {
  return (
    <div className="repair-material-table-wrapper">
      <table className="table repair-material-table mb-0">
        <thead>
          <tr>
            <th style={{ width: "80px" }}>
              ID
            </th>

            <th>Repair Material</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {repairMaterials.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="repair-material-empty-state"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            repairMaterials.map((item) => (
              <tr key={item.id}>
                {/* ID */}

                <td>
                  <span className="repair-material-id">
                    {item.id}
                  </span>
                </td>

                {/* NAME */}

                <td>
                  <span className="repair-material-name">
                    {item.name}
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

export default RepairMaterialTable;