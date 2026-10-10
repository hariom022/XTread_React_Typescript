
import type { OrderItem } from "../types/customerApprovalList.type";

interface Props {
  order: OrderItem;
}

const ExistingOrderHeader = ({ order }: Props) => {
  return (
    <div className="card border-0 bg-light mb-3">
      <div className="card-body py-3">
        <div className="row g-3">
          <div className="col-md-4">
            <small className="text-muted d-block">
              Order Number
            </small>
            <strong>{order.orderNumber || "-"}</strong>
          </div>

          <div className="col-md-4">
            <small className="text-muted d-block">
              Customer
            </small>
            <strong>
              {order.customer?.customerName || "-"}
            </strong>
          </div>

          <div className="col-md-4">
            <small className="text-muted d-block">
              Order Date
            </small>
            <strong>
              {order.createdAtUtc?.split("T")[0] || "-"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExistingOrderHeader;
