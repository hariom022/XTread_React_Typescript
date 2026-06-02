import React from "react";

export interface Column<T = any> {
  header: string;
  accessor?: keyof T | string;
  className?: string;
  headerClassName?: string;
  render?: (row: T, rowIndex: number) => React.ReactNode;
}

interface CommonTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

const CommonTable = <T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = "No data found",
}: CommonTableProps<T>) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle bg-white">
        <thead className="table-light">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={column.headerClassName || ""}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-muted py-4"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id ?? rowIndex}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={column.className || ""}
                  >
                    {column.render
                      ? column.render(row, rowIndex)
                      : column.accessor
                      ? row[column.accessor as string] ?? "-"
                      : "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommonTable;