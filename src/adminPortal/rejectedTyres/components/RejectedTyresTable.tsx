import { useMemo, useState } from "react";
import useRejectedTyres from "../hooks/useRejectedTyres";
import rejectedTyreServiceApi from "../services/rejectedTyreServiceApi";
import type { RejectedTyre } from "../types/rejectedTyres.types";

const RejectedTyresTable = () => {
  const {
    result,
    loading,
    fetchRejectedTyres,
  } = useRejectedTyres();

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [reversing, setReversing] = useState(false);

  // Group records by customer
  const groupedByCustomer = useMemo(() => {
    return result.reduce<Record<string, RejectedTyre[]>>(
      (groups, item) => {
        const customer = item.customerName || "Unknown Customer";

        if (!groups[customer]) {
          groups[customer] = [];
        }

        groups[customer].push(item);

        return groups;
      },
      {}
    );
  }, [result]);

  // Select / unselect single row
  const toggleRow = (id: number) => {
    setSelectedRows((previous) =>
      previous.includes(id)
        ? previous.filter((x) => x !== id)
        : [...previous, id]
    );
  };

  // Select / unselect all
  const toggleAll = () => {
    if (selectedRows.length === result.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(result.map((item) => item.orderCasingId));
    }
  };

  // Format API date
  const formatDate = (date: string) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB");
  };

  // Reverse selected casings
  const handleReverse = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one casing.");
      return;
    }

    try {
      setReversing(true);

      await rejectedTyreServiceApi.reverseRejectedTyres(selectedRows);

      // Clear selection
      setSelectedRows([]);

      // Reload table
      await fetchRejectedTyres();

      alert("Casing reversed successfully.");
    } catch (error) {
      console.error("Error reversing casings:", error);
      alert("Failed to reverse casing.");
    } finally {
      setReversing(false);
    }
  };

  return (
    <>
      <div className="table-responsive m-2">
        <table className="table table-bordered table-hover align-middle bg-white">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    result.length > 0 &&
                    selectedRows.length === result.length
                  }
                  onChange={toggleAll}
                />
              </th>

              <th>Date</th>

              <th>Order No</th>

              <th>Tyre Ref No</th>

              <th>Batch No</th>

              <th>DOT No</th>

              <th>Is Retreaded</th>

              <th>Tyre Size</th>

              <th>Make</th>

              <th>Pattern</th>

              <th>Service Type</th>

              <th>Rejected At</th>

              <th>Rejection Reason</th>

             
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={14} className="text-center py-4">
                  Loading rejected casings...
                </td>
              </tr>
            ) : result.length === 0 ? (
              <tr>
                <td colSpan={14} className="text-center py-4">
                  No rejected casings found.
                </td>
              </tr>
            ) : (
              Object.entries(groupedByCustomer).map(
                ([customerName, items]) => (
                  <>
                    {/* Customer Header */}
                    <tr
                      key={`customer-${customerName}`}
                      className="table-primary"
                    >
                      <td colSpan={14} className="fw-bold">
                        {customerName}
                      </td>
                    </tr>

                    {/* Customer Rows */}
                    {items.map((item) => (
                      <tr key={item.orderCasingId}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(
                              item.orderCasingId
                            )}
                            onChange={() =>
                              toggleRow(item.orderCasingId)
                            }
                          />
                        </td>

                        {/* Date */}
                        <td>
                          {formatDate(item.rejectedAtUtc)}
                        </td>

                        {/* Order No */}
                        <td>{item.orderNumber || "-"}</td>

                        {/* Tyre Reference */}
                        <td>
                          {item.tyreReferenceNumber || "-"}
                        </td>

                        {/* Batch No */}
                        <td>{item.batchNumber || "-"}</td>

                        {/* DOT */}
                        <td>{item.dotNumber || "-"}</td>

                        {/* Is Retreaded */}
                        <td>
                          {item.serviceTypeName?.toLowerCase() ===
                          "retread"
                            ? "Yes"
                            : "No"}
                        </td>

                        {/* Tyre Size */}
                        <td>-</td>

                        {/* Make */}
                        <td>{item.tyreMakeName || "-"}</td>

                        {/* Pattern */}
                        <td>-</td>

                        {/* Service Type */}
                        <td>{item.serviceTypeName || "-"}</td>

                        {/* Rejected At Stage */}
                        <td>
                          {item.rejectedAtStageName || "-"}
                        </td>

                        {/* Rejection Reason */}
                        <td>
                          {item.rejectionReasonName || "-"}
                        </td>

                        {/* Actions */}
                        {/* <td>
                          <div className="d-flex gap-1">
                            <button
                              type="button"
                              className="btn btn-sm btn-info text-white"
                              title="View"
                            >
                              <i className="bi bi-info-circle"></i>
                            </button>
                          </div>
                        </td> */}
                      </tr>
                    ))}
                  </>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Reverse Button */}
      <div className="mb-3 d-flex gap-2 mt-2 p-1 justify-content-end">
        <button
          type="button"
          className="btn btn-success"
          disabled={selectedRows.length === 0 || reversing}
          onClick={handleReverse}
        >
          <b>
            {reversing ? "Reversing..." : "Reverse Casing"}
          </b>
        </button>
      </div>
    </>
  );
};

export default RejectedTyresTable;