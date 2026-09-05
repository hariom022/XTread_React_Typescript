import { useEffect, useState } from "react";

import type {
    CourierService,
    CreateCourierServiceRequest,
    UpdateCourierServiceRequest,
} from "../types/courierServices.type";

interface CourierServiceFormProps {
    selectedCourierType: number;

    onCourierTypeChange: (
        courierType: number
    ) => void;

    editingCourierService:
    | CourierService
    | null;

    submitting: boolean;

    onCreate: (
        request: CreateCourierServiceRequest
    ) => Promise<void>;

    onUpdate: (
        courierServiceId: number,
        request: UpdateCourierServiceRequest
    ) => Promise<void>;

    onCancelEdit: () => void;
}

const CourierServiceForm = ({
    selectedCourierType,
    onCourierTypeChange,
    editingCourierService,
    submitting,
    onCreate,
    onUpdate,
    onCancelEdit,
}: CourierServiceFormProps) => {

    /*
     * ==========================================================
     * FORM STATE
     * ==========================================================
     */

    const [courierName, setCourierName] =
        useState<string>("");

    /*
     * Empty value initially.
     *
     * User must manually select:
     * 1 = External Courier
     * 2 = Internal Courier
     */
    const [courierType, setCourierType] =
        useState<number | "">("");

    const [code, setCode] =
        useState<string>("");

    const [contactPerson, setContactPerson] =
        useState<string>("");

    const [contactNumber, setContactNumber] =
        useState<string>("");

    const [email, setEmail] =
        useState<string>("");

    const [address, setAddress] =
        useState<string>("");

    const [isActive, setIsActive] =
        useState<boolean>(true);

    const [formError, setFormError] =
        useState<string>("");

    /*
     * ==========================================================
     * LOAD EDIT DATA
     * ==========================================================
     */

    useEffect(() => {

        if (editingCourierService) {

            setCourierName(
                editingCourierService.courierName
            );

            setCourierType(
                editingCourierService.courierType
            );

            setCode(
                editingCourierService.code || ""
            );

            setContactPerson(
                editingCourierService.contactPerson || ""
            );

            setContactNumber(
                editingCourierService.contactNumber || ""
            );

            setEmail(
                editingCourierService.email || ""
            );

            setAddress(
                editingCourierService.address || ""
            );

            setIsActive(
                editingCourierService.isActive
            );

            setFormError("");

        } else {

            resetForm();

        }

    }, [editingCourierService]);

    /*
     * ==========================================================
     * RESET FORM
     * ==========================================================
     */

    const resetForm = () => {

        setCourierName("");

        /*
         * Do NOT automatically select courier type.
         */
        setCourierType("");

        setCode("");

        setContactPerson("");

        setContactNumber("");

        setEmail("");

        setAddress("");

        setIsActive(true);

        setFormError("");
    };

    /*
     * ==========================================================
     * COURIER TYPE CHANGE
     * ==========================================================
     */

    const handleCourierTypeChange = (
        value: number
    ) => {

        setCourierType(value);

        /*
         * Keep existing parent functionality.
         */
        onCourierTypeChange(value);
    };

    /*
     * ==========================================================
     * CONTACT NUMBER CHANGE
     *
     * Allow numbers only.
     *
     * Example:
     * 98765abc1001
     *
     * becomes:
     * 987651001
     * ==========================================================
     */

    const handleContactNumberChange = (
        value: string
    ) => {

        const numbersOnly =
            value.replace(/\D/g, "");

        setContactNumber(
            numbersOnly
        );
    };

    /*
     * ==========================================================
     * SUBMIT
     * ==========================================================
     */

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setFormError("");

        /*
         * ======================================================
         * VALIDATION
         * ======================================================
         */

        if (!courierName.trim()) {

            setFormError(
                "Courier Name is required."
            );

            return;
        }

        if (courierType === "") {

            setFormError(
                "Please select Courier Type."
            );

            return;
        }

        if (!code.trim()) {

            setFormError(
                "Courier Code is required."
            );

            return;
        }

        if (!contactPerson.trim()) {

            setFormError(
                "Contact Person is required."
            );

            return;
        }

        if (!contactNumber.trim()) {

            setFormError(
                "Contact Number is required."
            );

            return;
        }

        if (!email.trim()) {

            setFormError(
                "Email is required."
            );

            return;
        }

        if (!address.trim()) {

            setFormError(
                "Address is required."
            );

            return;
        }

        /*
         * Basic email validation
         */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {

            setFormError(
                "Please enter a valid email address."
            );

            return;
        }

        try {

            /*
             * ==================================================
             * UPDATE
             * ==================================================
             */

            if (editingCourierService) {

                await onUpdate(
                    editingCourierService.courierServiceId,
                    {
                        courierName:
                            courierName.trim(),

                        courierType:
                            Number(courierType),

                        code:
                            code.trim(),

                        contactPerson:
                            contactPerson.trim(),

                        contactNumber:
                            contactNumber.trim(),

                        email:
                            email.trim(),

                        address:
                            address.trim(),

                        isActive,
                    }
                );

            } else {

                /*
                 * ==================================================
                 * CREATE
                 * ==================================================
                 */

                await onCreate({

                    courierName:
                        courierName.trim(),

                    courierType:
                        Number(courierType),

                    code:
                        code.trim(),

                    contactPerson:
                        contactPerson.trim(),

                    contactNumber:
                        contactNumber.trim(),

                    email:
                        email.trim(),

                    address:
                        address.trim(),
                });
            }

            resetForm();

        } catch (err) {

            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong.";

            setFormError(message);
        }
    };

    /*
     * ==========================================================
     * CANCEL EDIT
     * ==========================================================
     */

    const handleCancel = () => {

        resetForm();

        onCancelEdit();
    };

    /*
     * ==========================================================
     * RENDER
     * ==========================================================
     */

    return (

        <div className="card border-0 shadow-sm mb-4" id="courier-service-form">

            {/* ==================================================
                HEADER
            =================================================== */}

            <div className="card-header bg-white border-bottom px-4 py-3">

                <h4 className="mb-0 fw-semibold text-dark">

                    {editingCourierService
                        ? "Update Courier Service"
                        : "Courier Service Registration"}

                </h4>

            </div>

            {/* ==================================================
                FORM BODY
            =================================================== */}

            <div className="card-body p-4">

                {/* ==================================================
                    ERROR
                =================================================== */}

                {formError && (

                    <div
                        className="alert alert-danger d-flex align-items-center mb-4"
                        role="alert"
                    >

                        <i className="bi bi-exclamation-triangle-fill me-2" />

                        <span>
                            {formError}
                        </span>

                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                    noValidate
                >

                    <div className="row g-4">

                        {/* ==================================================
                            COURIER NAME
                        =================================================== */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <label
                                htmlFor="courierName"
                                className="form-label fw-semibold text-dark"
                            >
                                Courier Name
                                <span className="text-danger ms-1">
                                    *
                                </span>
                            </label>

                            <div className="input-group">

                                <span className="input-group-text bg-light">
                                    <i className="bi bi-building text-secondary" />
                                </span>

                                <input
                                    id="courierName"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter courier name"
                                    value={courierName}
                                    onChange={(event) =>
                                        setCourierName(
                                            event.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    required
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            COURIER TYPE
                        =================================================== */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <label
                                htmlFor="courierType"
                                className="form-label fw-semibold text-dark"
                            >
                                Courier Type
                                <span className="text-danger ms-1">
                                    *
                                </span>
                            </label>

                            <div className="input-group">

                                <span className="input-group-text bg-light">
                                    <i className="bi bi-diagram-3 text-secondary" />
                                </span>

                                <select
                                    id="courierType"
                                    className="form-select"
                                    value={courierType}
                                    onChange={(event) =>
                                        handleCourierTypeChange(
                                            Number(
                                                event.target.value
                                            )
                                        )
                                    }
                                    disabled={submitting}
                                    required
                                >

                                    <option value="">
                                        Select Courier Type
                                    </option>

                                    <option value={1}>
                                        External Courier
                                    </option>

                                    <option value={2}>
                                        Internal Courier
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* ==================================================
                            CODE
                        =================================================== */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <label
                                htmlFor="courierCode"
                                className="form-label fw-semibold text-dark"
                            >
                                Courier Code
                                <span className="text-danger ms-1">
                                    *
                                </span>
                            </label>

                            <div className="input-group">

                                <span className="input-group-text bg-light">
                                    <i className="bi bi-upc-scan text-secondary" />
                                </span>

                                <input
                                    id="courierCode"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter courier code"
                                    value={code}
                                    onChange={(event) =>
                                        setCode(
                                            event.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    required
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            CONTACT PERSON
                        =================================================== */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <label
                                htmlFor="contactPerson"
                                className="form-label fw-semibold text-dark"
                            >
                                Contact Person
                                <span className="text-danger ms-1">
                                    *
                                </span>
                            </label>

                            <div className="input-group">

                                <span className="input-group-text bg-light">
                                    <i className="bi bi-person text-secondary" />
                                </span>

                                <input
                                    id="contactPerson"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter contact person"
                                    value={contactPerson}
                                    onChange={(event) =>
                                        setContactPerson(
                                            event.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    required
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            CONTACT NUMBER
                        =================================================== */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <label
                                htmlFor="contactNumber"
                                className="form-label fw-semibold text-dark"
                            >
                                Contact Number
                                <span className="text-danger ms-1">
                                    *
                                </span>
                            </label>

                            <div className="input-group">

                                <span className="input-group-text bg-light">
                                    <i className="bi bi-telephone text-secondary" />
                                </span>

                                <input
                                    id="contactNumber"
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={15}
                                    className="form-control"
                                    placeholder="Enter contact number"
                                    value={contactNumber}
                                    onChange={(event) =>
                                        handleContactNumberChange(
                                            event.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    required
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            EMAIL
                        =================================================== */}

                        <div className="col-12 col-md-6 col-lg-4">

                            <label
                                htmlFor="courierEmail"
                                className="form-label fw-semibold text-dark"
                            >
                                Email
                                <span className="text-danger ms-1">
                                    *
                                </span>
                            </label>

                            <div className="input-group">

                                <span className="input-group-text bg-light">
                                    <i className="bi bi-envelope text-secondary" />
                                </span>

                                <input
                                    id="courierEmail"
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter email address"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    required
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            ADDRESS
                        =================================================== */}

                        <div className="col-12">

                            <label
                                htmlFor="courierAddress"
                                className="form-label fw-semibold text-dark"
                            >
                                Address
                                <span className="text-danger ms-1">
                                    *
                                </span>
                            </label>

                            <div className="input-group">

                                <span className="input-group-text bg-light align-items-start pt-2">
                                    <i className="bi bi-geo-alt text-secondary" />
                                </span>

                                <textarea
                                    id="courierAddress"
                                    className="form-control"
                                    rows={3}
                                    placeholder="Enter courier service address"
                                    value={address}
                                    onChange={(event) =>
                                        setAddress(
                                            event.target.value
                                        )
                                    }
                                    disabled={submitting}
                                    required
                                />

                            </div>

                        </div>

                        {/* ==================================================
                            ACTIVE - UPDATE ONLY
                        =================================================== */}

                        {editingCourierService && (

                            <div className="col-12">

                                <div className="border rounded-3 bg-light p-3">

                                    <div className="form-check form-switch">

                                        <input
                                            id="courierServiceActive"
                                            type="checkbox"
                                            className="form-check-input"
                                            role="switch"
                                            checked={isActive}
                                            onChange={(event) =>
                                                setIsActive(
                                                    event.target.checked
                                                )
                                            }
                                            disabled={submitting}
                                        />

                                        <label
                                            htmlFor="courierServiceActive"
                                            className="form-check-label fw-semibold"
                                        >
                                            Active
                                        </label>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                    {/* ==================================================
                        BUTTONS
                    =================================================== */}

                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">

                        {/* Reset / Cancel */}

                        <button
                            type="button"
                            className="btn btn-light border px-4"
                            onClick={
                                editingCourierService
                                    ? handleCancel
                                    : resetForm
                            }
                            disabled={submitting}
                        >

                            <i className="bi bi-arrow-counterclockwise me-2" />

                            {editingCourierService
                                ? "Cancel"
                                : "Reset"}

                        </button>

                        {/* Submit */}

                        <button
                            type="submit"
                            className={`btn px-4 ${editingCourierService
                                ? "btn-warning"
                                : "btn-danger"
                                }`}
                            disabled={submitting}
                        >

                            {submitting ? (

                                <>

                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    />

                                    Saving...

                                </>

                            ) : (

                                editingCourierService
                                    ? "Update Courier Service"
                                    : "Add Courier Service"

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CourierServiceForm;