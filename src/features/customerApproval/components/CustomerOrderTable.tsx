import type { OrderItem } from "../types/customerApprovalList.type";

type Props = {
  groupedCollections: Record<string, OrderItem[]>;

  expandedCollection: string | null;

  toggleCollection: (orderNo: string) => void;

  handleOpenApproval: (orderNo: string, items: OrderItem[]) => void;
};

const CustomerOrderTable = ({
  groupedCollections,
  expandedCollection,
  toggleCollection,
  handleOpenApproval,
}: Props) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="table-responsive">
        <table className="table table-bordered align-middle mb-0">
          <thead className="table-danger">
            <tr>
              <th></th>

              <th>Date</th>

              <th>Customer Name</th>

              <th>Order No</th>

              <th>Total Casings</th>

              <th>Confirmation</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(groupedCollections).map(([orderNo, items]) => (
              <>
                <tr
                  key={orderNo}
                  onClick={() => toggleCollection(orderNo)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <td>{expandedCollection === orderNo ? "▼" : "▶"}</td>

                  <td>{items[0]?.createdAtUtc?.split("T")[0]}</td>

                  <td>{items[0]?.customer?.customerName}</td>

                  <td>{orderNo}</td>

                  <td>{items[0]?.casings?.length || 0}</td>

                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();

                        handleOpenApproval(orderNo, items);
                      }}
                    >
                      Confirm
                    </button>
                  </td>
                </tr>

                {expandedCollection === orderNo && (
                  <tr>
                    <td colSpan={6} className="p-3">
                      <table className="table table-bordered table-sm align-middle mb-0">
                        <thead className="table-danger">
                          <tr>
                            <th>Tyre Ref No</th>

                            <th>Other No</th>

                            <th>DOT No</th>

                            <th>Is Retreaded</th>

                            <th>Tyre Size</th>

                            <th>Make</th>

                            <th>Brand</th>

                            <th>Pattern</th>

                            <th>Service Type</th>

                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {items[0]?.casings?.map((casing) => (
                            <tr key={casing.orderCasingId}>
                              <td>{casing.tyreReferenceNumber || "-"}</td>

                              <td>{casing.otherNumber || "-"}</td>

                              <td>{casing.dotNumber || "-"}</td>

                              <td>
                                <span
                                  className={`badge ${
                                    casing.isRetreaded
                                      ? "bg-success"
                                      : "bg-secondary"
                                  }`}
                                >
                                  {casing.isRetreaded ? "Yes" : "No"}
                                </span>
                              </td>

                              <td>{casing.tyreSize?.casingSize || "-"}</td>

                              <td>{casing.tyreMake?.name || "-"}</td>

                              <td>{casing.retreadDetail?.brand || "-"}</td>

                              <td>
                                {casing.retreadDetail?.patternName || "-"}
                              </td>

                              <td>
                                <span className="badge bg-primary">
                                  {casing.serviceType?.name || "-"}
                                </span>
                              </td>

                              <td>
                                <div className="d-flex gap-2 justify-content-center">
                                  <button className="btn btn-sm btn-primary">
                                    <i className="bi bi-pencil-square"></i>
                                  </button>

                                  <button className="btn btn-sm btn-danger">
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerOrderTable;
