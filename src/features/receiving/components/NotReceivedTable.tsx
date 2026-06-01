import type { ReceivingRow } from "../types/receiving.types";

type Props = {
  data: ReceivingRow[];
  onView: (row: ReceivingRow) => void;
};

const NotReceivedTable = ({
  data,
  onView,
}: Props) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle bg-white">
        <thead>
          <tr>
            <th>Date</th>

            <th>Customer</th>

            <th>Order No</th>

            <th>Tyre Ref No</th>

            <th>Pattern</th>

            <th>Service</th>

            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                No Records Found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id}>
                <td>{row.date}</td>

                <td>{row.customerName}</td>

                <td>{row.orderNo}</td>

                <td>{row.tyreReferenceNumber}</td>

                <td>{row.treadPattern}</td>

                <td>{row.serviceType}</td>

                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onView(row)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NotReceivedTable;