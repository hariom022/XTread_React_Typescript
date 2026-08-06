import CommonTable from "../../../shared/components/CommonTable";

import type { DispatchRow} from "../type/dispatch.types";
import DispatchTeamModal from "./DispatchTeamModal";

interface Props {
  data: DispatchRow[];
}

const DispatchIndexTable =
  ({
    data,
  }: Props) => {
    const columns = [
      {
        header: "Date",

        render: (
          row: DispatchRow,
        ) =>
          new Date(
            row.date,
          ).toLocaleDateString(),
      },

      {
        header:"Delivery No#",

        accessor: "deliveryNo",
      },

      {
        header:"Sales Rep",

        accessor: "salesRep",
      },

      {
        header:"Customer",

        accessor: "customerName",
      },

      {
        header:"Courier Name",

        accessor:"courierName",
      },

      {
        header:"Driver",

        accessor: "driverName",
      },

      {
        header:"Action",

        render: () => (
          <button className="btn btn-primary btn-sm">
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