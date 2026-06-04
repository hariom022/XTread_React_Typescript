import CommonTable from "../../../shared/components/CommonTable";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns"; 

const NailInspectionTable = ({data,onInspect}:any) => {
  return (
    <CommonTable
      columns={indexPageColumns(onInspect)}
      data={data}
      groupBy="batchNo"
    />
  )
}

export default NailInspectionTable

