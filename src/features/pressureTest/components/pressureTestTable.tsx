
import CommonTable from "../../../shared/components/CommonTable";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns";

type Props = {
  data: any[];
  onInspect: (row: any) => void;
};

const PressureTestTable = ({
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

export default PressureTestTable;