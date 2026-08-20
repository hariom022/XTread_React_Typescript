import type { TyreSize } from "../types/tyreSize.types";

interface TyreSizeTableProps {
  tyreSizes: TyreSize[];
  loading: boolean;
}

const TyreSizeTable = ({
  tyreSizes,
  loading,
}: TyreSizeTableProps) => {
  return (
    <div className="tyre-size-table-wrapper">
      <table className="tyre-size-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Casing Size</th>
            <th>Rim</th>
            <th>Average Circumference</th>
            <th>Minimum</th>
            <th>Maximum</th>
            {/* <th>Display Order</th> */}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={7}
                className="tyre-size-empty-state"
              >
                <div className="tyre-size-loader">
                  Loading tyre sizes...
                </div>
              </td>
            </tr>
          ) : tyreSizes.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="tyre-size-empty-state"
              >
                No tyre sizes found.
              </td>
            </tr>
          ) : (
            tyreSizes.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <span className="tyre-size-id">
                    {index + 1}
                  </span>
                </td>

                <td>
                  <span className="tyre-size-casing">
                    {item.casingSize}
                  </span>
                </td>

                <td>
                  <span className="tyre-size-rim">
                    {item.rim}
                  </span>
                </td>

                <td>
                  <span className="tyre-size-circumference">
                    {item.averageCircumferenceMm} mm
                  </span>
                </td>

                <td>
                  <span className="tyre-size-min">
                    {item.minimumMm} mm
                  </span>
                </td>

                <td>
                  <span className="tyre-size-max">
                    {item.maximumMm} mm
                  </span>
                </td>

                {/* <td>
                  <span className="tyre-size-order">
                    {item.displayOrder}
                  </span>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TyreSizeTable;