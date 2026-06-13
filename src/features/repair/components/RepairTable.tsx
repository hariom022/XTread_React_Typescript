// import type { RepairRow } from "../type/repairTypes";

import CommonTable from "../../../shared/components/CommonTable";
import type { RepairRow } from "../type/repair.types";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns";
type Props = {
  data: RepairRow[];
  onInspect: (item: RepairRow) => void;
};

const RepairTable = ({
  data,
  onInspect,
}: Props) => {
  return (
    <CommonTable
      columns={indexPageColumns(onInspect)}
      data={data}
      groupBy="batchNo"
    />
  );
};

export default RepairTable;