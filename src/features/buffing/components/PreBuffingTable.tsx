import CommonTable from "../../../shared/components/CommonTable";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns"; 

interface Props {
  data: any[];
  onApprove: (item: any) => void;
}

const PreBuffingTable = ({
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

export default PreBuffingTable;