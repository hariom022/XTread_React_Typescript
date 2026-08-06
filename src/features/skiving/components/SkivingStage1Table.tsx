import CommonTable from "../../../shared/components/CommonTable";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns";

import type { SkivingStage1Row } from "../types/skivingStage1.types";

interface Props {
  data: SkivingStage1Row[];
  onApprove: (item: SkivingStage1Row) => void;
}

const SkivingStage1Table = ({
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

export default SkivingStage1Table;