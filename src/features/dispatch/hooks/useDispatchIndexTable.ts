import { useEffect, useState } from "react";

import type {
    DispatchRow,
} from "../type/dispatch.types";

const useDispatchIndexTable =
    () => {
        const [rows, setRows,] = useState<DispatchRow[]>([]);

        const [loading, setLoading,] = useState(false);

        const fetchRows =
            async () => {
                try {
                    setLoading(true);

                    const mockData: DispatchRow[] =
                        [
                            {
                                id: 1,
                                date: "2026-06-25",
                                deliveryNo: "DEV-001",

                                salesRep: "John",

                                customerName: "Rongai Workshop",

                                courierName: "DHL Express",

                                driverName: "Ravi Kumar",

                                vehicle: "UP78 AB1234",
                            },
                        ];
                    setRows(mockData,);
                } 
                finally { 
                    setLoading(false); 
                }
            };

        useEffect(() => {
            fetchRows();
        }, []);

        return {
            rows,
            loading,
            fetchRows,
        };
    };

export default useDispatchIndexTable;