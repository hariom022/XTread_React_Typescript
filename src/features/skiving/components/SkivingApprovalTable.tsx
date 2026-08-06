import CommonTable from "../../../shared/components/CommonTable";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns";

import type { SkivingApprovalRow } from "../types/skivingApproval.types";

interface Props {
  data: SkivingApprovalRow[];
  onApprove: (item: SkivingApprovalRow) => void;
}

const SkivingApprovalTable = ({
  data,
  onApprove,
}: Props) => {
  return (
    <CommonTable
      columns={indexPageColumns(onApprove)}
      data={data}
      groupBy="batchNo"
    />
  );
};

export default SkivingApprovalTable;