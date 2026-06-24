import type { ProductionSuccessData} from "../type/dispatch.types";

interface Props {
    show: boolean;
    data: ProductionSuccessData | null;
    onClose: () => void;
}

const ProductionSuccessModal = ({
    show,
    data,
    onClose,
}: Props) => {
    if (!show || !data) return null;

    return (
        <>
            <div className="modal fade show d-block">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">

                        <div className="modal-header bg-warning">
                            <h5 className="modal-title text-white">
                                Production
                            </h5>

                            <button
                                className="btn-close btn-close-white"
                                onClick={onClose}
                            />
                        </div>

                        <div className="modal-body d-flex align-items-center gap-3">

                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    background: "#0d6efd",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                }}
                            >
                                i
                            </div>

                            <div>
                                Customer :
                                <b>
                                    {" "}
                                    {data.customer}
                                </b>
                                , delivery order saved successfully.
                            </div>

                        </div>

                        <div className="modal-footer justify-content-center">
                            <button
                                className="btn btn-primary px-4"
                                onClick={onClose}
                            >
                                OK
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show"></div>
        </>
    );
};

export default ProductionSuccessModal;