import useCustomerDeliveryOrderModal from "../hooks/useCustomerDeliveryOrderModal";

import type { DispatchTeam, CustomerCasing } from "../type/dispatch.types";

interface Props {
    show: boolean;
    dispatchTeam: DispatchTeam;
    setDispatchTeam: React.Dispatch<
        React.SetStateAction<DispatchTeam>
    >;
    isInternal: boolean;
    onClose: () => void;
    onSave?: (data: any) => void;
}

const CustomerDeliveryOrderModal =
    ({
        show,
        dispatchTeam,
        setDispatchTeam,
        isInternal,
        onClose,
        onSave,
    }: Props) => {
        const modal =
            useCustomerDeliveryOrderModal(
                dispatchTeam,
            );

        const selectedCustomer =
            modal.customers.find(
                (c) =>
                    c.id ===
                    Number(
                        modal.selectedCustomerId,
                    ),
            );


        if (!show) return null;

        return (
            <>
                <div className="modal fade show d-block">
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title text-white">
                                    Customer Delivery Order
                                </h5>

                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        modal.reset();

                                        onClose();
                                    }}
                                />
                            </div>

                            <div className="modal-body text-start">

                                <div className="row mb-1">

                                    {/* LEFT */}

                                    <div className="col-md-6 border p-2">

                                        <h6>
                                            Delivery Order Details
                                        </h6>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <label>Date</label>

                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={
                                                        modal.deliveryDate
                                                    }
                                                    onChange={(e) =>
                                                        modal.setDeliveryDate(
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2">

                                            <label>
                                                Customer Name
                                            </label>

                                            <select
                                                className="form-select"
                                                value={
                                                    modal.selectedCustomerId
                                                }
                                                onChange={(e) =>
                                                    modal.setSelectedCustomerId(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    -- Select Customer --
                                                </option>

                                                {modal.customers.map(
                                                    (
                                                        customer,
                                                    ) => (
                                                        <option
                                                            key={
                                                                customer.id
                                                            }
                                                            value={
                                                                customer.id
                                                            }
                                                        >
                                                            {
                                                                customer.name
                                                            }
                                                        </option>
                                                    ),
                                                )}
                                            </select>

                                        </div>

                                        <div className="mt-2">

                                            <label>
                                                Service Type
                                            </label>

                                            <select
                                                className="form-select"
                                                value={
                                                    modal.serviceType
                                                }
                                                onChange={(e) =>
                                                    modal.setServiceType(
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    -- Select Service Type --
                                                </option>

                                                <option value="Retread">
                                                    Retread
                                                </option>

                                                <option value="Repair">
                                                    Repair
                                                </option>

                                                <option value="Claim">
                                                    Claim
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                    {/* RIGHT */}

                                    <div className="col-md-6 border p-2">

                                        <h6>
                                            Dispatch Team
                                        </h6>

                                        <div className="row">

                                            <div className="col-md-12">

                                                <label>
                                                    Sales Rep
                                                </label>

                                                <input
                                                    className="form-control"
                                                    value={
                                                        dispatchTeam.salesRep
                                                    }
                                                    readOnly
                                                    placeholder="Auto-filled based on customer"
                                                />

                                            </div>

                                        </div>

                                        <div className="row mt-2">

                                            <div className="col-md-6">

                                                <label>
                                                    Courier Service
                                                </label>

                                                <input
                                                    className="form-control"
                                                    value={
                                                        dispatchTeam.courierName
                                                    }
                                                    readOnly={
                                                        !isInternal
                                                    }
                                                    onChange={(e) =>
                                                        setDispatchTeam(
                                                            (prev) => ({
                                                                ...prev,
                                                                courierName:
                                                                    e.target.value,
                                                            }),
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="col-md-6">

                                                <label>
                                                    Reg No#
                                                </label>

                                                <input
                                                    className="form-control"
                                                    value={
                                                        dispatchTeam.regNo
                                                    }
                                                    readOnly={
                                                        !isInternal
                                                    }
                                                    onChange={(e) =>
                                                        setDispatchTeam(
                                                            (prev) => ({
                                                                ...prev,
                                                                regNo:
                                                                    e.target.value,
                                                            }),
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>

                                        <div className="row mt-2">

                                            <div className="col-md-6">

                                                <label>
                                                    Driver Name
                                                </label>

                                                <input
                                                    className="form-control"
                                                    value={
                                                        dispatchTeam.driverName
                                                    }
                                                    readOnly={
                                                        !isInternal
                                                    }
                                                    onChange={(e) =>
                                                        setDispatchTeam(
                                                            (prev) => ({
                                                                ...prev,
                                                                driverName:
                                                                    e.target.value,
                                                            }),
                                                        )
                                                    }
                                                />

                                            </div>

                                            <div className="col-md-6">

                                                <label>
                                                    ID No#
                                                </label>

                                                <input
                                                    className="form-control"
                                                    value={
                                                        dispatchTeam.driverId
                                                    }
                                                    readOnly={
                                                        !isInternal
                                                    }
                                                    onChange={(e) =>
                                                        setDispatchTeam(
                                                            (prev) => ({
                                                                ...prev,
                                                                driverId:
                                                                    e.target.value,
                                                            }),
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* TABLE SECTION */}

                                <div className="row">

                                    <div className="col-md-6 border p-2">

                                        <h6>
                                            Customer Casings
                                        </h6>

                                        <table className="table table-sm table-bordered">

                                            <thead>
                                                <tr className="bg-new">
                                                    <th>Casing No</th>
                                                    <th>Serial</th>
                                                    <th>Size</th>
                                                    <th>+</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {modal.availableCasings.map(
                                                    (
                                                        item: CustomerCasing,
                                                        index: number,
                                                    ) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {item.casing}
                                                            </td>

                                                            <td>
                                                                {item.serial}
                                                            </td>

                                                            <td>
                                                                {item.size}
                                                            </td>

                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-primary"
                                                                    onClick={() => modal.handleAddCasing(item)}
                                                                >
                                                                    +
                                                                </button>
                                                            </td>

                                                        </tr>
                                                    ),
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                    <div className="col-md-6">

                                        <div className="border p-2 mb-2">

                                            <h6>
                                                Repaired & Retreaded Casings
                                                ({modal.selectedCasings.length})
                                            </h6>

                                            <table className="table table-sm table-bordered">

                                                <thead>
                                                    <tr className="bg-new">
                                                        <th>Service</th>
                                                        <th>Casing No</th>
                                                        <th>Serial</th>
                                                        <th>Size</th>
                                                        <th>Make</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {modal.selectedCasings.map(
                                                        (
                                                            item: CustomerCasing,
                                                            index: number,
                                                        ) => (
                                                            <tr key={index}>

                                                                <td>
                                                                    {item.service}
                                                                </td>

                                                                <td>
                                                                    {item.casing}
                                                                </td>

                                                                <td>
                                                                    {item.serial}
                                                                </td>

                                                                <td>
                                                                    {item.size}
                                                                </td>

                                                                <td>MRF</td>

                                                            </tr>
                                                        ),
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                </div>

                                <div className="d-flex justify-content-between mt-3">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            modal.reset();
                                            onClose();
                                        }}
                                    >
                                        ← Close
                                    </button>

                                    <button
                                        className="btn btn-success px-4"
                                        onClick={() => {

                                            if (
                                                !modal.selectedCustomerId
                                            ) {
                                                alert(
                                                    "Please select customer",
                                                );

                                                return;
                                            }

                                            const payload = {
                                                deliveryNo:
                                                    modal.generateDONumber(),

                                                customer:
                                                    selectedCustomer?.name,

                                                salesRep:
                                                    dispatchTeam.salesRep,

                                                courier:
                                                    dispatchTeam.courierName,

                                                vehicle:
                                                    dispatchTeam.regNo,

                                                casings:
                                                    modal.selectedCasings,
                                            };

                                            onSave?.(payload);
                                            modal.reset();
                                        }}
                                    >
                                        ✔ Save Customer Delivery
                                    </button>

                                </div>

                            </div>


                        </div>

                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </>
        );
    };

export default CustomerDeliveryOrderModal;