import type { ChamberType } from "../type/curing.types";

interface Props {
    show: boolean;
    chamberType: ChamberType | "";
    setChamberType:
    React.Dispatch<
        React.SetStateAction<
            ChamberType | ""
        >
    >;
    onContinue: () => void;
    onClose: () => void;
}

const ChamberTypeModal = ({
    show,
    chamberType,
    setChamberType,
    onContinue,
    onClose,
}: Props) => {
    if (!show) return null;

    return (
        <>
            <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title">
                                Select Chamber
                            </h5>
                            <button
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            />
                        </div>
                        <div className="modal-body">
                            <label className="form-label">
                                Chamber Type
                            </label>
                            <select
                                className="form-select"
                                value={chamberType}
                                onChange={(e) =>
                                    setChamberType(
                                        e.target.value  as ChamberType | "",
                                    )
                                }
                            >
                                <option value="">Select Chamber</option>
                                <option value="Marangoni"> Marangoni Autoclave VT24</option>
                                <option value="Elgi"> Elgi Autoclave </option>
                            </select>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-primary"
                                disabled={!chamberType}
                                onClick={onContinue}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ChamberTypeModal;