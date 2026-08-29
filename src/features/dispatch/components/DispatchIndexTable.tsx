import CommonTable from "../../../shared/components/CommonTable";

import type { DispatchRow } from "../type/dispatch.types";

interface Props {
  data: DispatchRow[];

  onDetails: (deliverySheetId: number) => void;
}

const DispatchIndexTable = ({ data, onDetails }: Props) => {
  const columns = [
    // ==========================================
    // DATE
    // ==========================================

    {
      header: "Date",

      render: (row: DispatchRow) =>
        row.date ? new Date(row.date).toLocaleDateString("en-GB") : "",
    },

    // ==========================================
    // DELIVERY NO
    // ==========================================

    {
      header: "Delivery No#",

      accessor: "deliveryNo",
    },

    // ==========================================
    // SALES REP
    // ==========================================

    {
      header: "Sales Rep",

      accessor: "salesRep",
    },

    // ==========================================
    // CUSTOMER
    // ==========================================

    {
      header: "Customer",

      accessor: "customerName",
    },

    // ==========================================
    // COURIER
    // ==========================================

    {
      header: "Courier Name",

      accessor: "courierName",
    },

    // ==========================================
    // DRIVER
    // ==========================================

    {
      header: "Driver",

      accessor: "driverName",
    },

    // ==========================================
    // ACTION
    // ==========================================

    {
      header: "Action",

      render: (row: DispatchRow) => (
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => onDetails(row.id)}
        >
          Details
        </button>
      ),
    },
  ];

  return (
    <CommonTable
      columns={columns}
      data={data}
      emptyMessage="No Dispatch Records Found"
    />
  );
};

export default DispatchIndexTable;
