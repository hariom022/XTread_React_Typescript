import type { OrderItem } from "../types/collection.types";

type Props = {
  orderItems: OrderItem[];

  setOrderItems: React.Dispatch<
    React.SetStateAction<OrderItem[]>
  >;

  handleSaveOrder: () => void;
};

const OrderTable = ({
  orderItems,
  setOrderItems,
}: Props) => {

  const removeItem = (id: number) => {
    setOrderItems((prev) =>
      prev.filter((item) => item.id !== id),
    );
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Service</th>
            <th>Category</th>
            <th>Tyre Size</th>
            <th>Tyre Ref No</th>
            <th>DOT</th>
            <th>Pattern</th>
            <th>Width</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orderItems.map((item) => (
            <tr key={item.id}>
              <td>{item.serviceType}</td>

              <td>{item.category}</td>

              <td>{item.tyreSize}</td>

              <td>{item.serial}</td>

              <td>{item.dot}</td>

              <td>{item.pattern}</td>

              <td>{item.width}</td>

              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;