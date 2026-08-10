// import type { Casing, ReceivingRow } from "../types/receiving.types";

// import React from "react";

// type Props = {
//   groupedByCustomer: Record<string, ReceivingRow[]>;

//   selectedRows: number[];

//   setSelectedRows: React.Dispatch<React.SetStateAction<number[]>>;

//   onReceive: () => void;

//   onReject: () => void;

//   onView: (row: ReceivingRow) => void;
//   onEdit: (casing: Casing) => void;
// };

const RejectedTyresTable = () => {
    return (
    <>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle bg-white">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  
                />
              </th>

              <th>Date</th>

              {/* <th>Customer</th> */}

              <th>Order No</th>

              <th>Tyre Ref No</th>
              <th>Other No</th>

              <th>DOT No</th>
              <th>Is Retreaded</th>
              <th>Tyre Size</th>
              <th>Make</th>
              <th>Pattern</th>

              <th>Service Type</th>

              <th>Action</th>
            </tr>
          </thead>

          {/* <tbody>
            {Object.keys(groupedByCustomer).map((custId) => (
              <>
                <tr className="table-primary">
                  <td colSpan={13} className="fw-bold">
                    {groupedByCustomer[custId][0]?.customerName}
                  </td>
                </tr>

                {groupedByCustomer[custId].map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item.id)}
                        onChange={() => toggleRow(item.id)}
                      />
                    </td>

                    <td>{item.date}</td>

                    <td>{item.orderNo}</td>

                    <td>{item.tyreReferenceNumber}</td>

                    <td>{item.otherNumber}</td>

                    <td>{item.dotNo}</td>
                    <td>{Number(item.numberOfRetreads) > 0 ? "Yes" : "No"}</td>
                    <td>{item.casingSize}</td>

                    <td>{item.make}</td>
                    <td>{item.treadPattern}</td>

                    <td>{item.serviceType}</td>

                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-primary text-white"
                          onClick={() => onEdit(item.originalCasing)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        <button
                          className="btn btn-info btn-sm text-white"
                          onClick={() => onView(item)}
                        >
                          <i className="bi bi-info-circle"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody> */}
        </table>
      </div>
      <div className="mb-3 d-flex gap-2 mt-2 p-1 justify-content-end">
        <button className="btn btn-success" >
          <b>Reverse Casing </b>
        </button>
      </div>
    </>
  );
};

export default RejectedTyresTable;
