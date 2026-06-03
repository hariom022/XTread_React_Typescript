import React, { useState } from "react";

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
  groupBy?: string;
}

const CommonTable = <T extends Record<string, any>>({
  columns,
  data,
  emptyMessage = "No data found",
  groupBy,
}: CommonTableProps<T>) => {
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  const renderRow = (row: T, rowIndex: number) => (
    <tr key={row.id ?? rowIndex}>
      {columns.map((column, colIndex) => (
        <td key={colIndex} className={column.className || ""}>
          {column.render
            ? column.render(row, rowIndex)
            : column.accessor
              ? (row[column.accessor as string] ?? "-")
              : "-"}
        </td>
      ))}
    </tr>
  );

  // ================= NORMAL TABLE =================
  if (!groupBy) {
    return (
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle bg-white">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className={column.headerClassName || ""}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // ================= GROUPED TABLE =================

  const groupedData = data.reduce((acc: Record<string, T[]>, item: any) => {
    const key = item[groupBy] || "UNBATCHED";

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);

    return acc;
  }, {});

  return (
    <div className="table-responsive main-table-wrapper">
      <table className="table table-bordered align-middle mb-0">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.headerClassName || ""}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.entries(groupedData).map(([groupName, rows]) => {
            const isCollapsed = collapsedGroups[groupName];

            const firstRow: any = rows[0];

            const approved = firstRow.approved || 0;

            const rejected = firstRow.rejected || 0;

            const pending = firstRow.pending || 0;

            const previousStage = firstRow.previousStage || 0;

            const expectedTotal = firstRow.expectedTotal || rows.length;

            const processed = approved + rejected;

            const progress =
              expectedTotal > 0 ? (processed / expectedTotal) * 100 : 0;
            return (
              <React.Fragment key={groupName}>
                {/* BATCH HEADER */}
                <tr className="batch-separator-row">
                  <td colSpan={columns.length} className="main-colSpan">
                    <div className="batch-info-wrapper">
                      <div className="batch-left-section">
                        <button
                          type="button"
                          className="btn btn-sm border-0 shadow-none p-0"
                          onClick={() =>
                            setCollapsedGroups((prev) => ({
                              ...prev,
                              [groupName]: !prev[groupName],
                            }))
                          }
                        >
                          <i
                            className={`bi ${
                              isCollapsed
                                ? "bi-chevron-right"
                                : "bi-chevron-down"
                            }`}
                          />
                        </button>

                        <span className="batch-no">{groupName}</span>

                        <div className="progress custom-progress">
                          <div
                            className="progress-bar bg-success"
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                          <div
                            className="progress-bar bg-danger"
                            style={{
                              width: rejected > 0 ? "15%" : "0%",
                            }}
                          />
                        </div>

                        <span className="processed-text">
                         {processed}/{expectedTotal} processed
                        </span>
                      </div>

                      <div className="batch-right-section">
                        <span className="approved-text">
                          ● {approved} Approved
                        </span>

                        <span className="rejected-text">
                          ● {rejected} Rejected
                        </span>

                        <span className="pending-text">
                          ● {pending} Pending
                        </span>

                        <span className="previous-stage-text">
                          ● {previousStage} still at Previous Stage
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* ROWS */}
                {!isCollapsed &&
                  rows.map((row, rowIndex) => renderRow(row, rowIndex))}
              </React.Fragment>
            );
          })}

          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommonTable;
