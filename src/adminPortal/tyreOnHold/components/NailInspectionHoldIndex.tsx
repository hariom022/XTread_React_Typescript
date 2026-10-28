
import type { NailInspectionHoldOrder } from "../types/nailInspectionHold.types";

interface Props {
  data: NailInspectionHoldOrder[];
  onInspect: (order: NailInspectionHoldOrder) => void;
}

const NailInspectionHoldIndex = ({ data, onInspect }: Props) => {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Nail Inspection Hold Orders</h5>
      </div>

      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order No.</th>
                <th>Customer</th>
                <th>Hold Type</th>
                <th>Total Casings</th>
                <th>Requirement</th>
                <th>Tyre References</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center text-muted py-4"
                  >
                    No Nail Inspection Hold orders found.
                  </td>
                </tr>
              ) : (
                data.map((order) => (
                  <tr key={order.orderId}>
                    <td className="fw-semibold">
                      {order.orderNumber}
                    </td>

                    <td>{order.customerName || "-"}</td>

                    <td>{order.holdType}</td>

                    <td>{order.casings?.length ?? 0}</td>

                    <td>
                      {[
                        order.requiresLpo && "LPO Required",
                        order.requiresPayment && "Payment Required",
                      ]
                        .filter(Boolean)
                        .join(", ") || "-"}
                    </td>

                    <td>
                      {order.casings?.length
                        ? order.casings
                            .map((casing) => casing.tyreReferenceNumber)
                            .join(", ")
                        : "-"}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onInspect(order)}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NailInspectionHoldIndex;
