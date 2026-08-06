import useDispatchFinalizationModal from "../hooks/useDispatchFinallizationModal";
import { useState } from "react";
import DispatchDocumentFinalization from "./DispatchDocumentFinalization";
import type { DispatchFinalizationRow } from "../type/dispatch.types";

interface Props {
  show: boolean;

  rows: DispatchFinalizationRow[];

  onClose: () => void;

  onFinalize: (row: DispatchFinalizationRow) => void;
}

const DispatchFinalizationModal = ({
  show,
  rows,
  onClose,
  onFinalize,
}: Props) => {
  const modal = useDispatchFinalizationModal(rows);

  

  const groupedRows = modal.dispatchRows.reduce(
    (acc, item) => {
      if (!acc[item.vehicle]) {
        acc[item.vehicle] = [];
      }

      acc[item.vehicle].push(item);

      return acc;
    },
    {} as Record<string, DispatchFinalizationRow[]>,
  );

  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const [selectedRow, setSelectedRow] =
    useState<DispatchFinalizationRow | null>(null);

    if (!show) return null;
  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-white">
                🚚 Dispatch Initialisation
              </h5>

              <button className="btn-close btn-close-white" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr className="bg-new">
                      <th>Dispatch Date</th>

                      <th>Delivery Order No</th>

                      <th>Sales Rep</th>

                      <th>Customer</th>

                      <th>Courier</th>

                      <th>Driver</th>

                      <th>Zone</th>

                      <th>Review</th>

                      <th>Print</th>

                      <th>Finalize</th>

                      <th>Cancel</th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(groupedRows).map(
                      ([vehicle, vehicleRows]) => (
                        <>
                          <tr className="table-secondary">
                            <td colSpan={11}>
                              <b>Vehicle Reg No : {vehicle}</b>
                            </td>
                          </tr>

                          {vehicleRows.map((row) => (
                            <tr key={row.id}>
                              <td>{row.date}</td>

                              <td>{row.deliveryNo}</td>

                              <td>{row.salesRep}</td>

                              <td>{row.customerName}</td>

                              <td>{row.courierName}</td>

                              <td>{row.driverName}</td>

                              <td>{row.zone}</td>

                              <td>
                                <button
                                  className="btn btn-info btn-sm"
                                  onClick={() => modal.handleReview(row)}
                                >
                                  🔍
                                </button>
                              </td>

                              <td>
                                <button
                                  className="btn btn-secondary btn-sm"
                                  onClick={() => modal.handlePrint(row)}
                                >
                                  🖨
                                </button>
                              </td>

                              <td>
                                <button
                                  className="btn btn-success btn-sm"
                                  disabled={row.status === "Finalized"}
                                  onClick={() => {
                                    setSelectedRow(row);
                                    setShowDocumentModal(true);
                                  }}
                                >
                                  {row.status === "Finalized" ? "✔" : "📦"}
                                </button>
                              </td>

                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => modal.handleCancel(row.id)}
                                >
                                  ✖
                                </button>
                              </td>
                            </tr>
                          ))}
                        </>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show"></div>
      <DispatchDocumentFinalization
        show={showDocumentModal}
        onClose={() => {
          setShowDocumentModal(false);
          setSelectedRow(null);
        }}
        onProcess={() => {
          if (!selectedRow) return;

        //   modal.handleFinalize(selectedRow.id);

          onFinalize({
            ...selectedRow,
            status: "Finalized",
          });

          setShowDocumentModal(false);
          setSelectedRow(null);
        }}
      />
    </>
  );
};

export default DispatchFinalizationModal;
