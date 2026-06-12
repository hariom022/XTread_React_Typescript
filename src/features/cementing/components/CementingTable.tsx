import CommonTable from "../../../shared/components/CommonTable";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns"; 
function CementingTable({onInspect,data}:any) {
  return (
    <div>
      <CommonTable
      columns={indexPageColumns(onInspect)}
      data={data}
      groupBy="batchNo"
    />
    </div>
  )
}

export default CementingTable
