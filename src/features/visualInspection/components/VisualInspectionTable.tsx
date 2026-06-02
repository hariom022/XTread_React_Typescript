import CommonTable from "../../../shared/components/CommonTable";

// import { visualInspectionColumns }
import { indexPageColumns } from "../../../shared/constants/indexPageColumns"; 

const VisualInspectionTable = ({
  data,
  onInspect,
}: any) => {
  return (
    <CommonTable
      columns={indexPageColumns(onInspect)}
      data={data}
    />
  );
};

export default VisualInspectionTable;