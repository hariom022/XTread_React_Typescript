import type { TyreMake } from "../types/tyreMake.types";

interface TyreMakeTableProps {
  tyreMakes: TyreMake[];
}

const TyreMakeTable = ({
  tyreMakes,
}: TyreMakeTableProps) => {
  return (
    <div className="tyre-make-table-wrapper">
      <table className="table tyre-make-table mb-0">
        <thead>
          <tr>
            <th style={{ width: "80px" }}>
              ID
            </th>

            <th>Tyre Make</th>

            <th>Classification</th>

            {/* <th>Classification ID</th>

            <th>Classification Sort Order</th> */}

            <th>Sort Order</th>
          </tr>
        </thead>

        <tbody>
          {/* =========================
              NO RECORDS
          ========================= */}

          {tyreMakes.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="tyre-make-empty-state"
              >
                No Records Found
              </td>
            </tr>
          ) : (
            tyreMakes.map((item) => (
              <tr key={item.tyreMakeId}>
                {/* ID */}
                <td>
                  <span className="tyre-make-id">
                    {item.tyreMakeId}
                  </span>
                </td>

                {/* TYRE MAKE */}
                <td>
                  <span className="tyre-make-name">
                    {item.tyreMakeName}
                  </span>
                </td>

                {/* CLASSIFICATION */}
                <td>
                  <span className="tyre-classification-badge">
                    {item.tyreClassificationName}
                  </span>
                </td>

                {/* CLASSIFICATION ID */}
                {/* <td>
                  {item.tyreClassificationId}
                </td> */}

                {/* CLASSIFICATION SORT ORDER */}
                {/* <td>
                  {item.tyreClassificationSortOrder}
                </td> */}

                {/* SORT ORDER */}
                <td>
                  <span className="tyre-sort-order">
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

export default TyreMakeTable;