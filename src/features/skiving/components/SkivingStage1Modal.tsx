import React from "react";

import type {
    Machine,
    SkivingRepair,
    InspectionRepair,
    skivingStage1Row,
} from "../types/skivingStage1.types";

type Props = {
    selectedItem: skivingStage1Row | null;

    machines: Machine[];

    inspectionData: InspectionRepair[];

    skivingStation: string;
    setSkivingStation: React.Dispatch<
        React.SetStateAction<string>
    >;

    remarks: string;
    setRemarks: React.Dispatch<
        React.SetStateAction<string>
    >;

    skivingRepairs: SkivingRepair[];

    newRepair: SkivingRepair;

    setNewRepair: React.Dispatch<
        React.SetStateAction<SkivingRepair>
    >;

    addRepair: () => void;

    deleteRepair: (
        index: number
    ) => void;

    handleSave: () => Promise<boolean>;

    onClose: () => void;
};

const SkivingStage1Modal = ({
    selectedItem,
    machines,
    inspectionData,
    skivingStation,
    setSkivingStation,
    remarks,
    setRemarks,
    skivingRepairs,
    newRepair,
    setNewRepair,
    addRepair,
    deleteRepair,
    handleSave,
    onClose,
}: Props) => {
    return (
        <div
            className="modal show d-block"
            tabIndex={-1}
            style={{
                backgroundColor:
                    "rgba(0,0,0,0.5)",
            }}
        >
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content skiving-modal">
                    {/* HEADER */}
                    <div className="modal-header skiving-header d-flex align-items-center">
                        <h5 className="modal-title flex-grow-1 text-white">
                            SKIVING STAGE 1 - APPROVAL
                        </h5>

                        <div className="me-3 text-white text-end">
                            <div>John</div>
                        </div>

                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={() => {
                                onClose();
                            }}
                        />
                    </div>

                    {/* BODY */}
                    <div
                        className="modal-body"
                        style={{
                            overflowX: "hidden",
                        }}
                    >
                        {/* TOP BAR */}
                        <div className="mb-3">
                            <div className="modal-info m-0 p-1 mb-1 postbuff-top row text-nowrap">
                                <div className="col">
                                    <strong>
                                        Production No
                                    </strong>
                                    <div>
                                        {
                                            selectedItem?.casing
                                        }
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Serial No
                                    </strong>
                                    <div>
                                        {
                                            selectedItem?.serial
                                        }
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Customer Name
                                    </strong>
                                    <div>
                                        {
                                            selectedItem?.customerName
                                        }
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Tyre Size
                                    </strong>
                                    <div>
                                        {
                                            selectedItem?.tyreSize
                                        }
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        Requested Pattern
                                    </strong>
                                    <div>
                                        {
                                            selectedItem?.requestedPattern
                                        }
                                    </div>
                                </div>

                                <div className="col">
                                    <strong>
                                        ReApproved Pattern
                                    </strong>
                                    <div>
                                        {
                                            selectedItem?.reApprovedPattern
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DAMAGE / STATION / REMARK */}
                        <div className="col box p-1 mb-1">
                            <div className="row">
                                <div className="col-md-3">
                                    <label className="fw-semibold mb-1 d-block">
                                        Damage Level
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={
                                            selectedItem?.damageLevel ||
                                            ""
                                        }
                                        readOnly
                                    />
                                </div>

                                <div className="col-md-3">
                                    <label className="fw-semibold mb-1 d-block">
                                        Skiving Station
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            skivingStation
                                        }
                                        onChange={(
                                            e
                                        ) =>
                                            setSkivingStation(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Station
                                        </option>

                                        {machines.map(
                                            (
                                                machine
                                            ) => (
                                                <option
                                                    key={
                                                        machine.machineId
                                                    }
                                                    value={
                                                        machine.machineId
                                                    }
                                                >
                                                    {
                                                        machine.machineName
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="fw-semibold mb-1 d-block">
                                        Remark
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={remarks}
                                        onChange={(
                                            e
                                        ) =>
                                            setRemarks(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* MAIN SECTION */}
                        <div className="row gx-3">
                            {/* LEFT */}
                            <div className="col-md-6">
                                <div className="box h-100">
                                    <h5 className="text-center mb-3">
                                        Inspection Stage -
                                        Patches
                                    </h5>

                                    <div className="mb-2 px-2">
                                        <div className="table-responsive">
                                            <table className="table table-bordered align-middle">
                                                <thead className="table-danger">
                                                    <tr>
                                                        <th>
                                                            Location
                                                        </th>
                                                        <th>
                                                            Type
                                                        </th>
                                                        <th>
                                                            Found At
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {inspectionData.length ===
                                                        0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    3
                                                                }
                                                                className="text-center text-muted"
                                                            >
                                                                No
                                                                inspection
                                                                data
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        inspectionData.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        index
                                                                    }
                                                                >
                                                                    <td>
                                                                        {
                                                                            item.location
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.type
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            item.foundAt
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="col-md-6">
                                <div className="box h-100">
                                    <h5 className="text-center mb-3">
                                        SKIVING STAGE DATA
                                    </h5>

                                    {/* ADD REPAIR */}
                                    <div className="row g-1 mb-3 p-2 align-items-end">
                                        <div className="col-md-4">
                                            <select
                                                className="form-select"
                                                value={
                                                    newRepair.type
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setNewRepair(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            type: e
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Damage Type
                                                </option>

                                                <option value="Puncture">
                                                    Puncture
                                                </option>

                                                <option value="Side Wall Cut">
                                                    Side Wall
                                                    Cut
                                                </option>
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <select
                                                className="form-select"
                                                value={
                                                    newRepair.location
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setNewRepair(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            location:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Repair
                                                    Location
                                                </option>

                                                <option value="Side Wall">
                                                    Side Wall
                                                </option>

                                                <option value="Crown">
                                                    Crown
                                                </option>
                                            </select>
                                        </div>

                                        <div className="col-md-3">
                                            <button
                                                className="btn btn-danger w-100"
                                                onClick={
                                                    addRepair
                                                }
                                            >
                                                + Add
                                                Repair
                                            </button>
                                        </div>
                                    </div>

                                    {/* REPAIR TABLE */}
                                    <div className="mb-2 px-2">
                                        <div className="table-responsive">
                                            <table className="table table-bordered align-middle">
                                                <thead className="table-danger">
                                                    <tr>
                                                        <th>
                                                            Type
                                                        </th>
                                                        <th>
                                                            Location
                                                        </th>
                                                        <th>
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {skivingRepairs.length ===
                                                        0 ? (
                                                        <tr>
                                                            <td
                                                                colSpan={
                                                                    3
                                                                }
                                                                className="text-center text-muted"
                                                            >
                                                                No
                                                                repairs
                                                                added
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        skivingRepairs.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (
                                                                <tr
                                                                    key={
                                                                        index
                                                                    }
                                                                >
                                                                    <td>
                                                                        {
                                                                            item.type
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            item.location
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        <button
                                                                            className="btn btn-danger btn-sm"
                                                                            onClick={() =>
                                                                                deleteRepair(
                                                                                    index
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SAVE */}
                        <div className="text-end mt-3">
                            <button
                                className="btn save-btn px-5"
                                onClick={async () => {
                                    const success =
                                        await handleSave();

                                    if (success) {
                                        onClose();
                                    }
                                }}
                            >
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkivingStage1Modal;