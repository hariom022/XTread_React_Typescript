import type { QualityControlDetails, } from "../type/qualityControl.type";

interface Props {
    show: boolean;
    details: QualityControlDetails | null;

    rejectReason: string;
    setRejectReason: (value: string) => void;

    rejectComment: string;
    setRejectComment: (value: string) => void;

    onApprove: () => void;
    onReject: () => void;
    onClose: () => void;
}

const QualityControlModal =
    ({
        show,
        details,

        rejectReason,
        setRejectReason,

        rejectComment,
        setRejectComment,
    
        onApprove,
        onReject,
        onClose,
    }: Props) => {

        if (!show || !details) return null;

        return (
            <>
                <div className="modal fade show d-block">

                    <div className="modal-dialog modal-xl modal-dialog-centered">

                        <div className="modal-content">

                            <div className="modal-header bg-danger text-white">

                                <h4>
                                    Quality Control Stage
                                </h4>

                                <button
                                    className="btn-close btn-close-white"
                                    onClick={onClose}
                                />

                            </div>

                            <div className="modal-body">

                                <div className="row mb-3">

                                    <div className="col-md-3">
                                        <b>
                                            Production No
                                        </b>
                                        <div>
                                            {details.productionNumber}
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <b>
                                            Serial No
                                        </b>
                                        <div>
                                            {details.tyreReferenceNumber}
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <b>
                                            Customer
                                        </b>
                                        <div>
                                            {details.customerName}
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <b>
                                            Tyre Size
                                        </b>
                                        <div>
                                            {details.tyreSize}
                                        </div>
                                    </div>

                                </div>

                                <hr />

                                <button
                                    className="btn btn-success w-100 mb-3"
                                    onClick={onApprove}
                                >
                                    APPROVE
                                </button>

                                <select
                                    className="form-select mb-2"
                                    value={rejectReason}
                                    onChange={(e) =>
                                        setRejectReason(
                                            e.target.value,
                                        )
                                    }
                                >
                                    <option value="">
                                        Select Reason
                                    </option>

                                    <option>
                                        Sidewall Damage
                                    </option>

                                    <option>
                                        Bead Damage
                                    </option>

                                    <option>
                                        Multiple Nails
                                    </option>

                                </select>

                                <textarea
                                    rows={3}
                                    className="form-control mb-3"
                                    value={rejectComment}
                                    onChange={(e) =>
                                        setRejectComment(
                                            e.target.value,
                                        )
                                    }
                                />

                                <button
                                    className="btn btn-danger w-100"
                                    onClick={onReject}
                                >
                                    REJECT
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="modal-backdrop fade show"></div>
            </>
        );
    };

export default QualityControlModal;