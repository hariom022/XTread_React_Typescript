import type { DamageLevel } from "../types/damageLevel.types";

interface DamageLevelTableProps {
  damageLevels: DamageLevel[];
}

const DamageLevelTable = ({
  damageLevels,
}: DamageLevelTableProps) => {
  return (
    <div className="damage-level-table-wrapper">
      <table className="table damage-level-table mb-0">
        <thead>
          <tr>
            <th style={{ width: "80px" }}>
              ID
            </th>

            <th>Damage Level</th>

            <th>Sort Order</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {damageLevels.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="damage-level-empty-state"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            damageLevels.map((item) => (
              <tr key={item.damageLevelId}>

                {/* ID */}
                <td>
                  <span className="damage-level-id">
                    {item.damageLevelId}
                  </span>
                </td>

                {/* NAME */}
                <td>
                  <span className="damage-level-name">
                    {item.name}
                  </span>
                </td>

                {/* SORT ORDER */}
                <td>
                  <span className="damage-level-sort-order">
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

export default DamageLevelTable;
