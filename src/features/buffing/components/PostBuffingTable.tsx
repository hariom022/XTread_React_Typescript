import CommonTable from "../../../shared/components/CommonTable";
import type { PostBuffingRow } from "../types/postBuffingTypes";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns"; 


interface Props {
  data: any[];
  onApprove: (item: any) => void;
}

const PostBuffingTable = ({
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

export default PostBuffingTable;