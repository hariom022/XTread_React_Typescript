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
    <tr key={row.orderCasingId ?? row.id ?? rowIndex}>
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

            const summary =
              firstRow.originalBatch?.stageSummary ||
              firstRow.stageSummary ||
              {};

            const approved = firstRow.approved ?? summary.approved ?? 0;

            const rejected = firstRow.rejected ?? summary.rejected ?? 0;

            const pending = firstRow.pending ?? summary.pending ?? 0;

            const expectedTotal =
              firstRow.expectedTotal ?? summary.expectedTotal ?? rows.length;

            const stillAtPreviousStage =
              firstRow.stillAtPreviousStage ??
              summary.stillAtPreviousStage ??
              0;

            const rejectedAtPreviousStages =
              firstRow.rejectedAtPreviousStages ??
              summary.rejectedAtPreviousStages ??
              0;

            const isBatchFullyArrived = summary.isBatchFullyArrived ?? false;

            const isCompleteAtPreviousStage =
              summary.isCompleteAtPreviousStage ?? false;

            const isBatchCompleteAtStage =
              summary.isBatchCompleteAtStage ?? false;

            const processed = approved + rejected;

            const approvedWidth =
              expectedTotal > 0 ? (approved / expectedTotal) * 100 : 0;

            const rejectedWidth =
              expectedTotal > 0 ? (rejected / expectedTotal) * 100 : 0;

            const pendingWidth =
              expectedTotal > 0 ? (pending / expectedTotal) * 100 : 0;

            return (
              <React.Fragment key={groupName}>
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
                              width: `${approvedWidth}%`,
                            }}
                          />

                          <div
                            className="progress-bar bg-danger"
                            style={{
                              width: `${rejectedWidth}%`,
                            }}
                          />

                          <div
                            className="progress-bar bg-warning"
                            style={{
                              width: `${pendingWidth}%`,
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

                        {/* {stillAtPreviousStage > 0 && (
                          <span className="previous-stage-text">
                            ● {stillAtPreviousStage} Still At Previous Stage
                          </span>
                        )} */}

                        {rejectedAtPreviousStages > 0 && (
                          <span className="text-danger fw-semibold">
                            ● {rejectedAtPreviousStages} Rejected Upstream
                          </span>
                        )}

                        {isBatchFullyArrived ? (
                          <span className="text-success fw-semibold">
                            ✅ Fully Arrived
                          </span>
                        ) : (
                          <span className="text-warning fw-semibold">
                            ⏳ Partial Arrived
                          </span>
                        )}

                        {/* {isCompleteAtPreviousStage && (
                          <span className="text-success fw-semibold">
                            ✅ Previous Stage Complete
                          </span>
                        )}

                        {isBatchCompleteAtStage && (
                          <span className="text-primary fw-semibold">
                            ✅ Batch Complete At This Stage
                          </span>
                        )} */}
                      </div>
                    </div>
                  </td>
                </tr>

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
