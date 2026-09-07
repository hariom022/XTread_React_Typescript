import { useMemo, useState } from "react";

import useCustomerDispatchApproval from "../hooks/useCustomerDispatchApproval";

import CustomerDispatchApprovalModal from "./CustomerDispatchApprovalModal";

import type { CustomerDispatchOrderGroup } from "../types/customerDispatchApproval.type";

const CustomerDispatchIndex = () => {
  const { orders, loading, error, reload, approveCustomer } =
    useCustomerDispatchApproval();

  /*
   * ==========================================================
   * SELECTED CUSTOMER / DELIVERY SHEET GROUP
   * ==========================================================
   */

  const [selectedOrder, setSelectedOrder] =
    useState<CustomerDispatchOrderGroup | null>(null);

  /*
   * ==========================================================
   * CUSTOMER FILTER
   * ==========================================================
   */

  const [selectedCustomer, setSelectedCustomer] =
    useState<string>("All Customers");

  /*
   * ==========================================================
   * DATE FILTER
   * ==========================================================
   */

  const [selectedDate, setSelectedDate] = useState<string>("");

  /*
   * ==========================================================
   * EXPANDED ROWS
   * ==========================================================
   */

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  /*
   * ==========================================================
   * GROUP DATA
   *
   * IMPORTANT:
   *
   * API returns:
   *
   * Batch
   *   -> Casings
   *       -> customerName
   *       -> deliverySheetNo
   *
   * We first flatten all casings and then group them by:
   *
   *     Customer Name + Delivery Sheet No
   * ==========================================================
   */

  const groupedOrders = useMemo(() => {
    const groups = new Map<string, CustomerDispatchOrderGroup>();

    orders.forEach((order) => {
      if (!order.casings || order.casings.length === 0) {
        return;
      }

      order.casings.forEach((casing) => {
        const customerName = casing.customerName?.trim() || "Unknown Customer";

        const deliverySheetNo =
          casing.deliverySheetNo?.trim() || "No Delivery Sheet";

        /*
         * Grouping key
         *
         * Customer + Delivery Sheet
         */

        const groupId = `${customerName}__${deliverySheetNo}`;

        const existingGroup = groups.get(groupId);

        if (existingGroup) {
          /*
           * Add casing to existing customer + delivery sheet group
           */

          existingGroup.casings.push(casing);

          /*
           * Update total
           */

          existingGroup.totalCasings = existingGroup.casings.length;
        } else {
          /*
           * Create new group
           *
           * We spread the original order so any additional
           * properties required by the modal are preserved.
           */

          groups.set(groupId, {
            ...order,

            groupId,

            customerName,

            /*
             * Use casing date for the group date.
             */

            orderDate: casing.orderDate,

            /*
             * Delivery sheet is taken from casing.
             */

            deliverySheetNo: casing.deliverySheetNo ?? null,

            /*
             * First casing starts the group.
             */

            casings: [casing],

            totalCasings: 1,
          });
        }
      });
    });

    return Array.from(groups.values());
  }, [orders]);

  /*
   * ==========================================================
   * CUSTOMERS
   * ==========================================================
   */

  const customers = useMemo(() => {
    const names = groupedOrders
      .map((order) => order.customerName)
      .filter(Boolean);

    return ["All Customers", ...Array.from(new Set(names))];
  }, [groupedOrders]);

  /*
   * ==========================================================
   * FILTER
   * ==========================================================
   */

  const filteredOrders = useMemo(() => {
    return groupedOrders.filter((order) => {
      /*
       * Customer filter
       */

      const customerMatch =
        selectedCustomer === "All Customers" ||
        order.customerName === selectedCustomer;

      /*
       * Convert API datetime:
       *
       * 2026-07-04T09:20:43.862827
       *
       * into:
       *
       * 2026-07-04
       */

      const orderDate = order.orderDate
        ? order.orderDate.substring(0, 10)
        : "";

      const dateMatch = !selectedDate || orderDate === selectedDate;

      return customerMatch && dateMatch;
    });
  }, [groupedOrders, selectedCustomer, selectedDate]);

  /*
   * ==========================================================
   * EXPAND / COLLAPSE
   * ==========================================================
   */

  const toggleRow = (groupId: string) => {
    setExpandedRows((previous) => {
      const next = new Set(previous);

      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }

      return next;
    });
  };

  /*
   * ==========================================================
   * OPEN APPROVAL MODAL
   * ==========================================================
   */

  const handleConfirm = (order: CustomerDispatchOrderGroup) => {
    setSelectedOrder(order);
  };

  /*
   * ==========================================================
   * CLOSE MODAL
   * ==========================================================
   */

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  /*
   * ==========================================================
   * LOADING
   * ==========================================================
   */

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          minHeight: "400px",
        }}
      >
        <div
          className="spinner-border"
          style={{
            color: "#e52d3d",
          }}
        />

        <div
          className="mt-3"
          style={{
            color: "#667085",
          }}
        >
          Loading dispatched orders...
        </div>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-3"
      style={{
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      {/* =====================================================
          FILTER AREA
      ====================================================== */}

      <div className="d-flex flex-column flex-md-row align-items-md-center gap-3 mb-4">
        {/* Customer */}

        <div
          style={{
            width: "400px",
            maxWidth: "100%",
          }}
        >
          <select
            className="form-select"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            style={{
              height: "48px",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          >
            {customers.map((customer) => (
              <option key={customer} value={customer}>
                {customer}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}

        <div className="d-flex align-items-center gap-2">
          <label
            className="fw-bold mb-0"
            style={{
              fontSize: "16px",
            }}
          >
            Date:
          </label>

          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              height: "48px",
              width: "225px",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Reload */}

        <button
          type="button"
          className="btn btn-outline-secondary ms-md-auto"
          onClick={reload}
          style={{
            height: "45px",
            borderRadius: "8px",
          }}
        >
          <i className="bi bi-arrow-clockwise me-2" />
          Refresh
        </button>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
          <span>{error}</span>

          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={reload}
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div
        className="card border-0 shadow-sm"
        style={{
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr
                style={{
                  background: "#ff2738",
                }}
              >
                <th
                  style={{
                    width: "70px",
                    color: "#ffffff",
                  }}
                />

                <th
                  style={{
                    color: "#ffffff",
                    padding: "15px",
                  }}
                >
                  Date
                </th>

                <th
                  style={{
                    color: "#ffffff",
                    padding: "15px",
                  }}
                >
                  Customer Name
                </th>

                <th
                  style={{
                    color: "#ffffff",
                    padding: "15px",
                  }}
                >
                  Delivery Sheet No
                </th>

                <th
                  style={{
                    color: "#ffffff",
                    padding: "15px",
                  }}
                >
                  Total Casings
                </th>

                <th
                  style={{
                    color: "#ffffff",
                    padding: "15px",
                  }}
                >
                  Confirmation
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-5"
                    style={{
                      color: "#667085",
                    }}
                  >
                    <i
                      className="bi bi-inbox"
                      style={{
                        fontSize: "30px",
                      }}
                    />

                    <div className="mt-2">
                      No dispatched orders found.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedRows.has(order.groupId);

                  const displayDate = order.orderDate
                    ? order.orderDate.substring(0, 10)
                    : "-";

                  const deliverySheet =
                    order.deliverySheetNo || "No Delivery Sheet";

                  return (
                    <>
                      {/* ==================================
                            MAIN GROUP ROW
                      =================================== */}

                      <tr key={order.groupId}>
                        {/* Expand */}

                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm p-0"
                            onClick={() => toggleRow(order.groupId)}
                            style={{
                              width: "28px",
                              height: "28px",
                              color: "#1670d2",
                            }}
                          >
                            <i
                              className={
                                isExpanded
                                  ? "bi bi-caret-down-fill"
                                  : "bi bi-caret-right-fill"
                              }
                            />
                          </button>
                        </td>

                        {/* Date */}

                        <td>{displayDate}</td>

                        {/* Customer */}

                        <td className="fw-semibold">
                          {order.customerName}
                        </td>

                        {/* Delivery Sheet */}

                        <td>
                          {order.deliverySheetNo ? (
                            <span
                              className="badge"
                              style={{
                                background: "#eef7ff",
                                color: "#1670d2",
                                fontSize: "13px",
                                padding: "7px 10px",
                              }}
                            >
                              {order.deliverySheetNo}
                            </span>
                          ) : (
                            <span className="text-muted">
                              No Delivery Sheet
                            </span>
                          )}
                        </td>

                        {/* Total */}

                        <td>
                          <span className="fw-semibold">
                            {order.totalCasings}
                          </span>
                        </td>

                        {/* Confirm */}

                        <td>
                          <button
                            type="button"
                            className="btn text-white"
                            onClick={() => handleConfirm(order)}
                            style={{
                              background: "#159447",
                              border: "1px solid #159447",
                              borderRadius: "7px",
                              padding: "7px 14px",
                            }}
                          >
                            <i className="bi bi-check-circle me-1" />
                            Confirm
                          </button>
                        </td>
                      </tr>

                      {/* ==================================
                            EXPANDED CASINGS
                      =================================== */}

                      {isExpanded && (
                        <tr key={`${order.groupId}-details`}>
                          <td
                            colSpan={6}
                            className="p-3"
                            style={{
                              background: "#f8f9fa",
                            }}
                          >
                            <div className="mb-2">
                              <strong>
                                {order.customerName}
                              </strong>

                              <span className="mx-2 text-muted">
                                |
                              </span>

                              <span className="text-muted">
                                Delivery Sheet:
                              </span>

                              <strong className="ms-1">
                                {deliverySheet}
                              </strong>

                              <span className="mx-2 text-muted">
                                |
                              </span>

                              <span className="text-muted">
                                Casings:
                              </span>

                              <strong className="ms-1">
                                {order.totalCasings}
                              </strong>
                            </div>

                            <div className="table-responsive border rounded">
                              <table className="table table-sm mb-0">
                                <thead>
                                  <tr
                                    style={{
                                      background: "#f1f3f5",
                                    }}
                                  >
                                    <th>Tyre Ref No</th>

                                    <th>DOT No</th>

                                    <th>Production No</th>

                                    <th>Tyre Size</th>

                                    <th>Make</th>

                                    <th>Pattern</th>

                                    <th>Service</th>

                                    <th>Delivery Sheet</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {order.casings.map((casing) => (
                                    <tr
                                      key={casing.orderCasingId}
                                    >
                                      <td>
                                        {
                                          casing.tyreReferenceNumber
                                        }
                                      </td>

                                      <td>
                                        {casing.dotNumber}
                                      </td>

                                      <td>
                                        {
                                          casing.productionNumber
                                        }
                                      </td>

                                      <td>
                                        {casing.tyreSizeLabel}
                                      </td>

                                      <td>
                                        {casing.tyreMakeName}
                                      </td>

                                      <td>
                                        {casing.patternName || "-"}
                                      </td>

                                      <td>
                                        <span
                                          className="badge"
                                          style={{
                                            background: "#eef7ff",
                                            color: "#1670d2",
                                          }}
                                        >
                                          {
                                            casing.serviceTypeName
                                          }
                                        </span>
                                      </td>

                                      <td>
                                        {casing.deliverySheetNo ? (
                                          <span
                                            className="badge"
                                            style={{
                                              background: "#e8f5e9",
                                              color: "#159447",
                                            }}
                                          >
                                            {
                                              casing.deliverySheetNo
                                            }
                                          </span>
                                        ) : (
                                          <span className="text-muted">
                                            -
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          CUSTOMER APPROVAL MODAL
      ====================================================== */}

      {selectedOrder && (
        <CustomerDispatchApprovalModal
          order={selectedOrder}
          onClose={handleCloseModal}
          approveCustomer={approveCustomer}
        />
      )}
    </div>
  );
};

export default CustomerDispatchIndex;