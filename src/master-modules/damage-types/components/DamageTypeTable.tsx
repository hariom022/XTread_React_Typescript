import type { DamageType } from "../types/damageType.types";

interface DamageTypeTableProps {
  damageTypes: DamageType[];
}

const DamageTypeTable = ({
  damageTypes,
}: DamageTypeTableProps) => {
  return (
    <div className="damage-type-table-wrapper">
      <table className="table damage-type-table mb-0">
        <thead>
          <tr>
            <th style={{ width: "80px" }}>
              ID
            </th>

            <th>Damage Type</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {damageTypes.length === 0 ? (
            <tr>
              <td
                colSpan={2}
                className="damage-type-empty-state"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            damageTypes.map((item) => (
              <tr key={item.id}>
                {/* ID */}
                <td>
                  <span className="damage-type-id">
                    {item.id}
                  </span>
                </td>

                {/* NAME */}
                <td>
                  <span className="damage-type-name">
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

export default DamageTypeTable;