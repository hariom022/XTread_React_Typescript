import useDispatchFinalizationModal from "../hooks/useDispatchFinallizationModal";

import type { DispatchFinalizationRow, } from "../type/dispatch.types";

interface Props {
    show: boolean;

    rows: DispatchFinalizationRow[];

    onClose: () => void;

    onFinalize: (
        row: DispatchFinalizationRow,
    ) => void;
}

const DispatchFinalizationModal =
    ({
        show,
        rows,
        onClose,
        onFinalize,
    }: Props) => {

        const modal = useDispatchFinalizationModal(rows);

        if (!show) return null;

        const groupedRows =
            modal.dispatchRows.reduce(
                (
                    acc,
                    item,
                ) => {

                    if (!acc[item.vehicle]) {
                        acc[item.vehicle] = [];
                    }

                    acc[item.vehicle].push(item);

                    return acc;
                },
                {} as Record<
                    string,
                    DispatchFinalizationRow[]
                >,
            );

        return (
            <>
                <div className="modal fade show d-block">

                    <div className="modal-dialog modal-xl modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title text-white">
                                    🚚 Dispatch Initialisation
                                </h5>

                                <button
                                    className="btn-close btn-close-white"
                                    onClick={
                                        onClose
                                    }
                                />

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

                                            {Object.entries(
                                                groupedRows,
                                            ).map(
                                                ([
                                                    vehicle,
                                                    vehicleRows,
                                                ]) => (
                                                    <>
                                                        <tr className="table-secondary">

                                                            <td colSpan={11}>
                                                                <b>Vehicle Reg No :{" "}{vehicle}</b>
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
                                                                            onClick={() =>
                                                                                modal.handleReview( row,)
                                                                            }
                                                                        >
                                                                            🔍
                                                                        </button>
                                                                    </td>

                                                                    <td>
                                                                        <button
                                                                            className="btn btn-secondary btn-sm"
                                                                            onClick={() =>
                                                                                modal.handlePrint(row,)
                                                                            }
                                                                        >
                                                                            🖨
                                                                        </button>
                                                                    </td>

                                                                    <td>
                                                                        <button
                                                                            className="btn btn-success btn-sm"
                                                                            disabled={row.status ==="Finalized"}
                                                                            onClick={() =>
                                                                                onFinalize(row,)
                                                                            }
                                                                        >
                                                                            {row.status ==="Finalized"
                                                                                ? "✔"
                                                                                : "📦"}
                                                                        </button>
                                                                    </td>

                                                                    <td>
                                                                        <button
                                                                            className="btn btn-danger btn-sm"
                                                                            onClick={() =>
                                                                                modal.handleCancel(row.id,)
                                                                            }
                                                                        >
                                                                            ✖
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </>
                                                ),
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={
                                        onClose
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="modal-backdrop fade show"></div>
            </>
        );
    };

export default DispatchFinalizationModal;