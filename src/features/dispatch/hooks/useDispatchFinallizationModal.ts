import { useState } from "react";

import type { DispatchFinalizationRow,} from "../type/dispatch.types";

const useDispatchFinalizationModal = (initialRows: DispatchFinalizationRow[],) => {

    const [dispatchRows, setDispatchRows,] = useState(initialRows);

    const handleCancel = (
        id: number,
    ) => {
        setDispatchRows(
            (prev) =>
                prev.filter(
                    (x) => x.id !== id,
                ),
        );
    };

    const handleFinalize = (id: number) => {
        setDispatchRows(
            (prev) => prev.map((x) =>
                x.id === id ? {
                    ...x,
                    status: "Finalized",
                } : x,
            ),
        );
    };

    const handlePrint = (
        row: DispatchFinalizationRow,
    ) => {
        alert(
            `Printing Delivery Note: ${row.deliveryNo}`,
        );
    };

    const handleReview = (
        row: DispatchFinalizationRow,
    ) => {
        alert(
            `Reviewing Delivery Note: ${row.deliveryNo}`,
        );
    };

    return {
        dispatchRows,

        setDispatchRows,

        handleCancel,

        handleFinalize,

        handlePrint,

        handleReview,
    };
};

export default useDispatchFinalizationModal;