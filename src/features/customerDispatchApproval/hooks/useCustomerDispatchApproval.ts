// src/features/customerDispatchApproval/hooks/useCustomerDispatchApproval.ts

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import customerDispatchApprovalServiceApi
  from "../services/customerDispatchApprovalServiceApi";

import type {
  CustomerApprovalRequest,
  CustomerDispatchCasing,
  CustomerDispatchOrderGroup,
} from "../types/customerDispatchApproval.type";


const useCustomerDispatchApproval = () => {

  const [
    orders,
    setOrders,
  ] = useState<CustomerDispatchOrderGroup[]>([]);


  const [
    loading,
    setLoading,
  ] = useState<boolean>(true);


  const [
    error,
    setError,
  ] = useState<string>("");


  /*
   * ==========================================================
   * LOAD API DATA
   * ==========================================================
   */

  const loadDispatchedCasings =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await customerDispatchApprovalServiceApi
            .getDispatchedCasings();


        if (!response.success) {

          setError(
            response.error ||
            "Unable to load dispatched casings."
          );

          return;
        }


        /*
         * API structure:
         *
         * data[]
         *   batches[]
         *      casings[]
         */

        const allCasingData: {
          casing: CustomerDispatchCasing;
          batchNumber: string;
        }[] = [];


        response.data.forEach((stage) => {

          stage.batches.forEach((batch) => {

            batch.casings.forEach((casing) => {

              allCasingData.push({
                casing,
                batchNumber:
                  batch.batchNumber,
              });

            });

          });

        });


        /*
         * ======================================================
         * GROUP BY CUSTOMER + ORDER DATE
         *
         * Since API currently does not provide orderNo,
         * we use customer + date as temporary grouping.
         *
         * Once orderNo is returned by API, change groupId to:
         *
         * const groupId = casing.orderNo;
         * ======================================================
         */

        const groupedMap =
          new Map<
            string,
            CustomerDispatchOrderGroup
          >();


        allCasingData.forEach(
          ({
            casing,
            batchNumber,
          }) => {

            const orderDate =
              casing.orderDate
                ? casing.orderDate.substring(
                    0,
                    10
                  )
                : "";


            const groupId =
              `${casing.customerName}_${orderDate}`;


            if (!groupedMap.has(groupId)) {

              groupedMap.set(
                groupId,
                {
                  groupId,

                  customerName:
                    casing.customerName,

                  /*
                   * API does not currently return orderNo.
                   */
                  orderNo: "N/A",

                  orderDate,

                  totalCasings: 0,

                  casings: [],

                  batchNumbers: [],
                }
              );

            }


            const group =
              groupedMap.get(groupId)!;


            /*
             * Avoid duplicate casing
             */

            const alreadyExists =
              group.casings.some(
                (item) =>
                  item.orderCasingId ===
                  casing.orderCasingId
              );


            if (!alreadyExists) {

              group.casings.push(
                casing
              );

              group.totalCasings += 1;

            }


            /*
             * Add batch number only once
             */

            if (
              !group.batchNumbers.includes(
                batchNumber
              )
            ) {

              group.batchNumbers.push(
                batchNumber
              );

            }

          }
        );


        setOrders(
          Array.from(
            groupedMap.values()
          )
        );

      } catch (err) {

        console.error(
          "Error loading dispatched casings:",
          err
        );

        setError(
          "Unable to load dispatched casings."
        );

      } finally {

        setLoading(false);

      }

    }, []);


  /*
   * Load when component mounts
   */

  useEffect(() => {

    loadDispatchedCasings();

  }, [loadDispatchedCasings]);


  /*
   * ==========================================================
   * APPROVE CUSTOMER
   * ==========================================================
   */

  const approveCustomer = async (
    request: CustomerApprovalRequest
  ) => {

    return await customerDispatchApprovalServiceApi
      .approveCustomer(request);

  };


  return {

    orders,

    loading,

    error,

    reload:
      loadDispatchedCasings,

    approveCustomer,

  };
};


export default useCustomerDispatchApproval;