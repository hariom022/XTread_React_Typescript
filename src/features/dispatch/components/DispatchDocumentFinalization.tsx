import { useState } from "react";

interface Props {
    show: boolean;
    onClose: () => void;
    onProcess: () => void;
}

const DispatchDocumentFinalization = ({
    show,
    onClose,
    onProcess,
}: Props) => {

    const [verified, setVerified] = useState(false);

    const [printed, setPrinted] = useState(false);

    const [signed, setSigned] = useState(false);

    if (!show) return null;

    const canProcess =
        verified &&
        printed &&
        signed;

    return (
        <>
            <div className="modal fade show d-block">

                <div className="modal-dialog modal-dialog-centered">

                    <div className="modal-content">

                        <div className="modal-header bg-secondary">

                            <h5 className="modal-title text-white">
                                Dispatch Document Finalization
                            </h5>

                            <button
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            />

                        </div>

                        <div className="modal-body">

                            <h5>Dispatch Verification</h5>

                            <div className="form-check mt-3">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={verified}
                                    onChange={(e) =>
                                        setVerified(e.target.checked)
                                    }
                                />

                                <label className="form-check-label">
                                    Dispatch items verified
                                </label>

                            </div>

                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={printed}
                                    onChange={(e) =>
                                        setPrinted(e.target.checked)
                                    }
                                />

                                <label className="form-check-label">
                                    Dispatch Printed
                                </label>

                            </div>

                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={signed}
                                    onChange={(e) =>
                                        setSigned(e.target.checked)
                                    }
                                />

                                <label className="form-check-label">
                                    Document Signed
                                </label>

                            </div>

                        </div>

                        <div className="modal-footer justify-content-between">

                            <button
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                ← Cancel
                            </button>

                            <button
                                className="btn btn-success"
                                disabled={!canProcess}
                                onClick={onProcess}
                            >
                                ✔ Process
                            </button>

                        </div>

                    </div>

                </div>

            </div>

            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default DispatchDocumentFinalization;