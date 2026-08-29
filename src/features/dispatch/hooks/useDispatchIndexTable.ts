import { useEffect, useState } from "react";

import type { DispatchRow } from "../type/dispatch.types";

import dispatchServiceApi from "../service/dispatchServiceApi";


const useDispatchIndexTable = () => {

    const [rows, setRows] =
        useState<DispatchRow[]>([]);

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // GET APPROVED DELIVERY SHEETS
    // ==========================================

    const getApprovedCasingsOnDispatch =
        async () => {

            try {

                setLoading(true);


                console.log(
                    "=========================================="
                );

                console.log(
                    "🚚 GET APPROVED DELIVERY SHEETS"
                );

                console.log(
                    "API: /delivery-sheets?isApproved=true"
                );


                const response =
                    await dispatchServiceApi
                        .getApprovedCasingOnDispatch();


                console.log(
                    "🚚 Delivery Sheets API Response:",
                    response.data
                );


                // ==========================================
                // API VALIDATION
                // ==========================================

                if (!response.data?.success) {

                    console.error(
                        "Delivery Sheets API failed:",
                        response.data?.error
                    );

                    setRows([]);

                    return;
                }


                // ==========================================
                // GET DATA
                // ==========================================

                const deliverySheets =
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : [];


                console.log(
                    "🚚 Delivery Sheets:",
                    deliverySheets
                );


                // ==========================================
                // MAP DELIVERY SHEETS
                // TO DISPATCH ROW
                // ==========================================

                const dispatchRows: DispatchRow[] =
                    deliverySheets.map(
                        (item: any) => ({

                            // Delivery Sheet ID
                            id:
                                item.deliverySheetId,


                            // Created Date
                            date:
                                item.createdAtUtc ??
                                "",


                            // Delivery Sheet Number
                            deliveryNo:
                                item.deliverySheetNumber ??
                                "",


                            // Not available in this API response
                            salesRep:
                                "",


                            // Not available in this API response
                            customerName:
                                "",


                            // Courier
                            courierName:
                                item.courierName ??
                                "",


                            // Driver
                            driverName:
                                item.driverName ??
                                "",


                            // Vehicle Registration
                            vehicle:
                                item.vehicleRegNo ??
                                "",


                            // Approval status
                            status:
                                item.isApproved
                                    ? "Approved"
                                    : "Pending",


                            // No casing details returned
                            // by this API
                            casings:
                                [],

                        })
                    );


                console.log(
                    "🚚 FINAL DISPATCH INDEX ROWS:",
                    dispatchRows
                );


                setRows(
                    dispatchRows
                );


            } catch (error) {

                console.error(
                    "❌ Error fetching approved delivery sheets:",
                    error
                );

                setRows([]);

            } finally {

                setLoading(false);

            }
        };


    // ==========================================
    // LOAD API ON PAGE LOAD
    // ==========================================

    useEffect(() => {

        getApprovedCasingsOnDispatch();

    }, []);


    // ==========================================
    // RETURN
    // ==========================================

    return {

        rows,

        loading,

        refresh:
            getApprovedCasingsOnDispatch,

    };

};


export default useDispatchIndexTable;