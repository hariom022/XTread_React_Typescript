import CommonTable from "../../../shared/components/CommonTable";
import { shearographyColumns } from "../constants/shearographyColumns";
// import { visualInspectionColumns }
// import { indexPageColumns } from "../../../shared/constants/indexPageColumns"; 

const VisualInspectionTable = ({
  data,
  onInspect,
}: any) => {
  return (
    <CommonTable
      columns={shearographyColumns(onInspect)}
      data={data}
      groupBy="batchNo"
    />
  );
};

export default VisualInspectionTable;