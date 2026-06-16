import { useMemo, useState } from "react";
import type {
    AllocatedRailRow,
    EnvelopingRow,
    RailType,
} from "../type/enveloping.type";

interface Props {
    show: boolean;

    railType: RailType | "";

    availableRows: EnvelopingRow[];

    allocatedRows: AllocatedRailRow[];

    allocateRail: (
        row: EnvelopingRow,
        railNo: number,
    ) => void;

    removeFromRail: (
        row: AllocatedRailRow,
    ) => void;

    processEnvelope: () => void;

    onClose: () => void;
}

const EnvelopingBatchModal = ({
    show,
    railType,

    availableRows,
    allocatedRows,

    allocateRail,

    removeFromRail,

    processEnvelope,

    onClose,
}: Props) => {
    const [searchTerm, setSearchTerm] =
        useState("");

    const [
        selectedAllocatedRow,
        setSelectedAllocatedRow,
    ] =
        useState<AllocatedRailRow | null>(
            null,
        );

    const usedRailNumbers =
        allocatedRows.map(
            (x) => String(x.railNo),
        );

    const filteredRows =
        availableRows.filter(
            (item) =>
                item.productionNumber
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase(),
                    ) ||
                item.tyreReferenceNumber
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase(),
                    ),
        );
    if (!show) return null;

    return (
        <>
            <div className="modal fade show d-block">
                <div className="modal-dialog modal-xl modal-dialog-centered">

                    <div className="modal-content">

                        {/* HEADER */}

                        <div className="modal-header bg-danger text-white">

                            <h4 className="modal-title">
                                ENVELOPING BATCH
                            </h4>

                            <button
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            />

                        </div>

                        {/* BODY */}

                        <div className="modal-body">

                            {/* TOP HEADER */}

                            <div
                                className="d-flex justify-content-between align-items-center mb-3 px-3 py-2 rounded"
                                style={{
                                    backgroundColor: "#e9f2ff",
                                }}
                            >
                                <h5 className="fw-bold mb-0">
                                    Ramp Rail - Casing Allocation
                                </h5>

                                <div className="d-flex align-items-center gap-2">

                                    <span className="fw-semibold">
                                        Staff Name
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        style={{
                                            width: "180px",
                                        }}
                                        value="John"
                                        readOnly
                                    />

                                </div>

                            </div>

                            {/* RAIL BADGE + SEARCH */}

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <div>

                                    {railType && (
                                        <span className="rail-badge">

                                            <b>{railType}</b>

                                        </span>
                                    )}

                                </div>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Casing No / Serial No"
                                    style={{
                                        width: "250px",
                                    }}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            {/* AVAILABLE TABLE */}

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead className="table-light">

                                        <tr>

                                            <th>
                                                Production Number
                                            </th>

                                            <th>Date</th>

                                            <th>
                                                Batch Number
                                            </th>

                                            <th>
                                                TyreRef Number
                                            </th>

                                            <th>
                                                Available @ Station / Batch
                                            </th>

                                            <th>
                                                TimeSinceBuilding
                                            </th>

                                            <th>
                                                Rail No
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredRows.map(
                                            (item: EnvelopingRow) => (
                                                <tr
                                                    key={
                                                        item.orderCasingId
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            item.productionNumber
                                                        }
                                                    </td>

                                                    <td>
                                                        {new Date(
                                                            item.orderDate
                                                        ).toLocaleDateString()}
                                                    </td>

                                                    <td>
                                                        {
                                                            item.batchNumber
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.tyreReferenceNumber
                                                        }
                                                    </td>

                                                    <td>
                                                        Building
                                                    </td>

                                                    <td>--</td>

                                                    <td
                                                        style={{
                                                            width:
                                                                "120px",
                                                        }}
                                                    >

                                                        <select
                                                            className="form-select form-select-sm"
                                                            defaultValue=""
                                                            onChange={(
                                                                e,
                                                            ) =>
                                                                allocateRail(
                                                                    item,
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                                )
                                                            }
                                                        >

                                                            <option value="">
                                                                Select
                                                            </option>

                                                            {[...Array(28)]
                                                                .map(
                                                                    (
                                                                        _,
                                                                        i
                                                                    ) =>
                                                                        (
                                                                            i +
                                                                            1
                                                                        ).toString()
                                                                )
                                                                .filter(
                                                                    (
                                                                        railNo
                                                                    ) =>
                                                                        !usedRailNumbers.includes(
                                                                            railNo
                                                                        )
                                                                )
                                                                .map(
                                                                    (
                                                                        railNo
                                                                    ) => (
                                                                        <option
                                                                            key={
                                                                                railNo
                                                                            }
                                                                            value={
                                                                                railNo
                                                                            }
                                                                        >
                                                                            {
                                                                                railNo
                                                                            }
                                                                        </option>
                                                                    )
                                                                )}

                                                        </select>

                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            {/* ALLOCATED TABLE */}

                            <div className="mt-4">

                                <h6 className="fw-bold">

                                    Allocated Rail Location to Casings

                                </h6>

                                <table className="table table-bordered table-hover">

                                    <thead className="table-light">

                                        <tr>

                                            <th
                                                style={{
                                                    width:
                                                        "40px",
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                />
                                            </th>

                                            <th>
                                                Production Number
                                            </th>

                                            <th>Date</th>

                                            <th>
                                                Batch Number
                                            </th>

                                            <th>
                                                TyreRef Number
                                            </th>

                                            <th>
                                                Available @ Station / Batch
                                            </th>

                                            <th>
                                                TimeSinceBuilding
                                            </th>

                                            <th>
                                                Rail Location
                                            </th>

                                            <th>
                                                Rail No
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {allocatedRows.length ===
                                            0 ? (
                                            <tr>

                                                <td
                                                    colSpan={9}
                                                    className="text-center text-muted"
                                                >
                                                    No casings allocated yet
                                                </td>

                                            </tr>
                                        ) : (
                                            allocatedRows.map(
                                                (item: AllocatedRailRow) => (
                                                    <tr
                                                        key={
                                                            item.orderCasingId
                                                        }
                                                    >

                                                        <td>

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    selectedAllocatedRow?.orderCasingId ===
                                                                    item.orderCasingId
                                                                }
                                                                onChange={() =>
                                                                    setSelectedAllocatedRow(
                                                                        item
                                                                    )
                                                                }
                                                            />

                                                        </td>

                                                        <td>
                                                            {
                                                                item.productionNumber
                                                            }
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                item.orderDate
                                                            ).toLocaleDateString()}
                                                        </td>

                                                        <td>
                                                            {
                                                                item.batchNumber
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                item.tyreReferenceNumber
                                                            }
                                                        </td>

                                                        <td>
                                                            Building
                                                        </td>

                                                        <td>--</td>

                                                        <td>
                                                            {
                                                                item.railLocation
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                item.railNo
                                                            }
                                                        </td>

                                                    </tr>
                                                )
                                            )
                                        )}

                                    </tbody>

                                </table>

                                <div className="text-end">

                                    <button
                                        className="btn btn-warning"
                                        onClick={() => {
                                            if (
                                                selectedAllocatedRow
                                            ) {

                                                removeFromRail(
                                                    selectedAllocatedRow,
                                                );

                                                setSelectedAllocatedRow(
                                                    null,
                                                );

                                            }
                                        }}
                                    >
                                        Remove From Rail
                                    </button>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="modal-footer">

                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={
                                    processEnvelope
                                }
                            >
                                Process Envelope
                            </button>

                        </div>

                    </div>

                </div>
            </div>

            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default EnvelopingBatchModal;