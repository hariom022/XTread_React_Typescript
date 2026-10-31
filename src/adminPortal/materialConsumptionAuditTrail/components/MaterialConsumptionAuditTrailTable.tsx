import type {
  MaterialConsumptionAuditTrailItem,
  MaterialConsumptionAuditTrailResponse,
} from "../types/materialConsumptionAuditTrail.types";

type Props = {
  items: MaterialConsumptionAuditTrailItem[];
  pagination: MaterialConsumptionAuditTrailResponse;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (item: MaterialConsumptionAuditTrailItem) => void;
  onRequest: (requestId: number) => void;
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleString();
};

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "succeeded":
      return "audit-status-success";

    case "failed":
      return "audit-status-failed";

    case "pending":
      return "audit-status-pending";

    default:
      return "audit-status-default";
  }
};

const MaterialConsumptionAuditTrailTable = ({
  items,
  pagination,
  currentPage,
  pageSize,
  loading,
  onPageChange,
  onPageSizeChange,
  onView,
  onRequest,
}: Props) => {
  const totalPages = pagination.totalPages;
  const totalCount = pagination.totalCount;

  const startRecord = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endRecord = Math.min(currentPage * pageSize, totalCount);

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="card material-audit-list-card">
      <div className="material-audit-list-toolbar">
        <div>
          <h3>Material Consumption Audit Trail</h3>
          <p>View SAP material consumption request history</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table material-audit-table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Request ID</th>
              <th>Order Number</th>
              <th>Customer Name</th>
              <th>Production Number</th>
              <th>Barcode Number</th>
              <th>Batch Number</th>
              <th>Finished Material</th>
              <th>Status</th>
              <th>Attempts</th>
              <th>Last Attempt</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} className="text-center py-4">
                  Loading material consumption requests...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center py-4">
                  No material consumption requests found.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.requestId}>
                  <td>{startRecord + index}</td>

                  <td>{item.requestId}</td>

                  <td>{item.orderNumber || "-"}</td>

                  <td>{item.customerName || "-"}</td>

                  <td>{item.productionNumber || "-"}</td>

                  <td>{item.barcodeNumber || "-"}</td>

                  <td>{item.batchNumber || "-"}</td>

                  <td>{item.finishedMaterial || "-"}</td>

                  <td>
                    <span
                      className={`audit-status-badge ${getStatusClass(
                        item.statusName,
                      )}`}
                    >
                      {item.statusName || "-"}
                    </span>
                  </td>

                  <td>
                    {item.attemptCount} / {item.maxAutomaticAttempts}
                  </td>

                  <td>{formatDate(item.lastAttemptAtUtc)}</td>

                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {/* VIEW BUTTON */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onView(item)}
                      >
                        <i className="bi bi-eye me-1"></i>
                        View
                      </button>

                      {/* REQUESTS BUTTON */}
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onRequest(item.requestId)}
                      >
                        <i className="bi bi-list-ul me-1"></i>
                        Requests
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="material-audit-pagination">
        <div className="d-flex align-items-center flex-wrap gap-2">
          <span>Rows per page:</span>

          <select
            className="form-select form-select-sm"
            style={{ width: "75px" }}
            value={pageSize}
            disabled={loading}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <span className="text-muted">
            Showing {startRecord} to {endRecord} of {totalCount} records
          </span>
        </div>

        <div className="d-flex align-items-center gap-1 flex-wrap">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1 || loading}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>

          {pages.map((page) => (
            <button
              key={page}
              type="button"
              className={`btn btn-sm ${
                currentPage === page ? "btn-danger" : "btn-outline-secondary"
              }`}
              disabled={loading}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialConsumptionAuditTrailTable;
