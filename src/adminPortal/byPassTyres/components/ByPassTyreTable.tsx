import React, { useState, useEffect, useRef } from "react";

const STAGES = [
    { id: 4, name: "NAIL INSPECTION" },
    { id: 5, name: "PRESSURE TEST" },
    { id: 6, name: "SHEAROGRAPHY" },
    { id: 7, name: "PRE BUFFING" },
];

const ByPassTyreTable = ({ data, skipStages, loading }: any) => {
    const [expanded, setExpanded] = useState<string[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Only one stage can be selected
    const [selectedStage, setSelectedStage] = useState<number | null>(null);

    const [showModal, setShowModal] = useState(false);

    const toggleExpand = (key: string) => {
        setExpanded((prev) =>
            prev.includes(key)
                ? prev.filter((x) => x !== key)
                : [...prev, key]
        );
    };

    const toggleRow = (id: number, e: any) => {
        e.stopPropagation();

        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (!selectedIds.length) {
            alert("Select at least one row");
            return;
        }

        setShowModal(true);
    };

    const handleBypass = async () => {
        if (selectedStage === null) {
            alert("Please select a stage");
            return;
        }

        try {
            // selectedStage contains the selected stage ID
            await skipStages(selectedIds, selectedStage);

            setSelectedIds([]);
            setSelectedStage(null);
            setShowModal(false);
        } catch (err) {
            alert("Failed to bypass stages");
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString();
    };

    const selectAllRef = useRef<HTMLInputElement>(null);

    const getAllVisibleIds = () => {
        return data.flatMap((parent: any) =>
            expanded.includes(parent.batchNumber)
                ? parent.casings.map((c: any) => c.orderCasingId)
                : []
        );
    };

    useEffect(() => {
        const allIds = getAllVisibleIds();

        if (selectAllRef.current) {
            const selectedCount = allIds.filter((id: number) =>
                selectedIds.includes(id)
            ).length;

            selectAllRef.current.indeterminate =
                selectedCount > 0 && selectedCount < allIds.length;
        }
    }, [selectedIds, expanded, data]);

    const handleSelectAll = () => {
        const allIds = getAllVisibleIds();

        const allSelected =
            allIds.length > 0 &&
            allIds.every((id: number) => selectedIds.includes(id));

        if (allSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !allIds.includes(id))
            );
        } else {
            setSelectedIds((prev) => [
                ...new Set([...prev, ...allIds]),
            ]);
        }
    };

    return (
        <>
            <table className="table table-bordered">
                <thead className="bg-danger text-white">
                    <tr>
                        <th>
                            <input
                                ref={selectAllRef}
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                    getAllVisibleIds().length > 0 &&
                                    getAllVisibleIds().every((id: number) =>
                                        selectedIds.includes(id)
                                    )
                                }
                            />
                        </th>

                        <th>Production No</th>
                        <th>Date</th>
                        <th>Tyre Ref</th>
                        <th>Pattern</th>
                        <th>Make</th>
                        <th>Size</th>
                        <th>Service</th>
                    </tr>
                </thead>

                <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={8} className="text-center">
                                No Data Found
                            </td>
                        </tr>
                    )}

                    {data.map((parent: any) => (
                        <React.Fragment key={parent.batchNumber}>
                            <tr
                                style={{
                                    background: "#eee",
                                    cursor: "pointer",
                                }}
                                onClick={() =>
                                    toggleExpand(parent.batchNumber)
                                }
                            >
                                <td>
                                    {expanded.includes(parent.batchNumber)
                                        ? "▼"
                                        : "▶"}
                                </td>

                                <td colSpan={7}>
                                    <b>Batch Number: </b>
                                    <b>{parent.batchNumber}</b>
                                </td>
                            </tr>

                            {expanded.includes(parent.batchNumber) &&
                                parent.casings.map((c: any) => (
                                    <tr key={c.orderCasingId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(
                                                    c.orderCasingId
                                                )}
                                                onChange={(e) =>
                                                    toggleRow(
                                                        c.orderCasingId,
                                                        e
                                                    )
                                                }
                                            />
                                        </td>

                                        <td>{c.productionNo}</td>
                                        <td>{formatDate(c.date)}</td>
                                        <td>{c.tyreRefNo}</td>
                                        <td>{c.pattern}</td>
                                        <td>{c.make}</td>
                                        <td>{c.tyreSize}</td>
                                        <td>{c.service}</td>
                                    </tr>
                                ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className="btn d-flex justify-content-end">
                <button
                    className="btn btn-primary"
                    disabled={!selectedIds.length}
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>

            {/* MODAL */}
            {showModal && (
                <>
                    <div className="modal fade show d-block" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">

                                {/* HEADER */}
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        Select Stage
                                    </h5>

                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => {
                                            setShowModal(false);
                                            setSelectedStage(null);
                                        }}
                                    ></button>
                                </div>

                                {/* BODY */}
                                <div className="modal-body">

                                    <label className="form-label fw-bold">
                                        Select Stage
                                    </label>

                                    <select
                                        className="form-select"
                                        value={selectedStage ?? ""}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            setSelectedStage(
                                                value === ""
                                                    ? null
                                                    : Number(value)
                                            );
                                        }}
                                    >
                                        <option value="">
                                            -- Select Stage --
                                        </option>

                                        {STAGES.map((stage) => (
                                            <option
                                                key={stage.id}
                                                value={stage.id}
                                            >
                                                {stage.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>

                                {/* FOOTER */}
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-danger"
                                        onClick={handleBypass}
                                        disabled={
                                            loading ||
                                            selectedStage === null
                                        }
                                    >
                                        {loading
                                            ? "Processing..."
                                            : "Bypass"}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* BACKDROP */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
};

export default ByPassTyreTable;