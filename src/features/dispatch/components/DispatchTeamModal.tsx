import useDispatchTeamModal from "../hooks/useDispatchTeamModal";
import { useState } from "react";
import type { DispatchTeam } from "../type/dispatch.types";

interface Props {
    show: boolean;

    onClose: () => void;

    onContinue: () => void;
    setDispatchTeam: React.Dispatch<
        React.SetStateAction<DispatchTeam>
    >;
}

const DispatchTeamModal =
    ({
        show,
        onClose,
        onContinue,
        setDispatchTeam,
    }: Props) => {
        const modal = useDispatchTeamModal();

        // const [
        //     showCustomerModal,
        //     setShowCustomerModal,
        // ] = useState(false);

        // const [
        //     dispatchTeam,
        //     setDispatchTeam,
        // ] = useState({
        //     salesRep: "",
        //     courierName: "",
        //     regNo: "",
        //     driverName: "",
        //     driverId: "",
        // });

        if (!show) return null;

        return (
            <>
                <div className="modal fade show d-block">

                    <div className="modal-dialog modal-lg modal-dialog-centered">

                        <div className="modal-content">

                            {/* HEADER */}

                            <div className="modal-header text-white">

                                <h5 className="modal-title text-white">
                                    Dispatch Team
                                </h5>

                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        modal.reset();

                                        onClose();
                                    }}
                                />

                            </div>

                            {/* BODY */}

                            <div className="modal-body">

                                <ul className="nav nav-tabs mb-3">

                                    <li className="nav-item">

                                        <button
                                            className={`nav-link ${modal.activeTab ===
                                                "add"
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                modal.setActiveTab(
                                                    "add",
                                                )
                                            }
                                        >
                                            Add Courier
                                        </button>

                                    </li>

                                    <li className="nav-item">

                                        <button
                                            className={`nav-link ${modal.activeTab ===
                                                "select"
                                                ? "active"
                                                : ""
                                                }`}
                                            onClick={() =>
                                                modal.setActiveTab(
                                                    "select",
                                                )
                                            }
                                        >
                                            Select Courier
                                        </button>

                                    </li>

                                </ul>

                                {/* ADD COURIER */}

                                {modal.activeTab ===
                                    "add" && (
                                        <>
                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <label>
                                                        Courier Service
                                                    </label>

                                                    <select
                                                        className="form-select"
                                                        value={
                                                            modal
                                                                .selectedCourier
                                                                ?.id ||
                                                            ""
                                                        }
                                                        onChange={(
                                                            e,
                                                        ) => {
                                                            const courier =
                                                                modal.courierList.find(
                                                                    (
                                                                        c,
                                                                    ) =>
                                                                        c.id ===
                                                                        Number(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                ) ||
                                                                null;

                                                            modal.setSelectedCourier(
                                                                courier,
                                                            );

                                                            modal.setSelectedVehicle(
                                                                "",
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Select
                                                        </option>

                                                        {modal.courierList.map(
                                                            (
                                                                courier,
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        courier.id
                                                                    }
                                                                    value={
                                                                        courier.id
                                                                    }
                                                                >
                                                                    {
                                                                        courier.name
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <label>
                                                        Vehicle Reg No
                                                    </label>

                                                    <select
                                                        className="form-select"
                                                        value={
                                                            modal.selectedVehicle
                                                        }
                                                        onChange={(
                                                            e,
                                                        ) =>
                                                            modal.setSelectedVehicle(
                                                                e
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Select
                                                        </option>

                                                        {modal.selectedCourier?.vehicles.map(
                                                            (
                                                                vehicle,
                                                                index,
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        index
                                                                    }
                                                                    value={
                                                                        vehicle
                                                                    }
                                                                >
                                                                    {
                                                                        vehicle
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>

                                                </div>

                                            </div>

                                            <div className="row">

                                                <div className="col-md-6 mb-3">

                                                    <label>
                                                        Driver Name
                                                    </label>

                                                    <input
                                                        className="form-control"
                                                        value={
                                                            modal.driverName
                                                        }
                                                        onChange={(
                                                            e,
                                                        ) =>
                                                            modal.setDriverName(
                                                                e
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                    />

                                                </div>

                                                <div className="col-md-6 mb-3">

                                                    <label>
                                                        Driver ID
                                                    </label>

                                                    <input
                                                        className="form-control"
                                                        value={
                                                            modal.driverId
                                                        }
                                                        onChange={(
                                                            e,
                                                        ) =>
                                                            modal.setDriverId(
                                                                e
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-end">

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        setDispatchTeam({
                                                            salesRep: "",
                                                            courierName:
                                                                modal.selectedCourier?.name || "",
                                                            regNo:
                                                                modal.selectedVehicle,
                                                            driverName:
                                                                modal.driverName,
                                                            driverId:
                                                                modal.driverId,
                                                        });
                                                        modal.reset();

                                                        onContinue();
                                                    }}
                                                >

                                                    Continue to Dispatch →
                                                </button>

                                            </div>
                                        </>
                                    )}

                                {/* SELECT COURIER */}

                                {modal.activeTab ===
                                    "select" && (
                                        <>
                                            <select
                                                className="form-select mb-3"
                                                value={
                                                    modal.courierType
                                                }
                                                onChange={(
                                                    e,
                                                ) =>
                                                    modal.setCourierType(
                                                        e.target
                                                            .value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select Type
                                                </option>

                                                <option value="Internal">
                                                    Internal
                                                </option>

                                                <option value="External">
                                                    External
                                                </option>
                                            </select>

                                            <table className="table table-bordered">

                                                <thead>

                                                    <tr>
                                                        <th>✔</th>

                                                        <th>Courier</th>

                                                        <th>Reg No</th>

                                                        <th>Driver</th>
                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {modal.existingCouriers.map(
                                                        (
                                                            item,
                                                        ) => (
                                                            <tr
                                                                key={item.id}
                                                            >
                                                                <td>
                                                                    <input
                                                                        type="radio"
                                                                        checked={
                                                                            modal.selectedCourierId ===
                                                                            item.id
                                                                        }
                                                                        onChange={() =>
                                                                            modal.setSelectedCourierId(
                                                                                item.id,
                                                                            )
                                                                        }
                                                                    />
                                                                </td>

                                                                <td>
                                                                    {item.name}
                                                                </td>

                                                                <td>
                                                                    {item.regNo}
                                                                </td>

                                                                <td>
                                                                    {item.driver}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}

                                                </tbody>

                                            </table>

                                            <div className="text-end">

                                                <button
                                                    className="btn btn-success"

                                                    onClick={() => {
                                                        setDispatchTeam({
                                                            salesRep: "",
                                                            courierName:
                                                                modal.selectedCourier?.name || "",
                                                            regNo:
                                                                modal.selectedVehicle,
                                                            driverName:
                                                                modal.driverName,
                                                            driverId:
                                                                modal.driverId,
                                                        });
                                                        modal.reset();

                                                        onContinue();
                                                    }}
                                                >
                                                    Continue to Dispatch →
                                                </button>

                                            </div>
                                        </>
                                    )}

                            </div>

                        </div>
                    </div>
                </div >
                <div className="modal-backdrop fade show"></div>
            </>
        );
    };

export default DispatchTeamModal;