import React from 'react'
import CommonTable from "../../../shared/components/CommonTable";
import { indexPageColumns } from "../../../shared/constants/indexPageColumns";
function TreadBenchTable({onInspect,data}:any) {
  return (
    <div>
          <div>
      <CommonTable
      columns={indexPageColumns(onInspect)}
      data={data}
      groupBy="batchNo"
    />
    </div>
    </div>
  )
}

export default TreadBenchTable
