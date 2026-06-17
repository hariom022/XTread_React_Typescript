import CommonTable from "../../../shared/components/CommonTable";

import { indexPageColumns } from "../../../shared/constants/indexPageColumns";

import type {
  QualityControlRow,
} from "../type/qualityControl.type";

interface Props {
  data: QualityControlRow[];

  onInspect: (
    item: QualityControlRow,
  ) => void;
}

const QualityControlIndexTable =
  ({
    data,
    onInspect,
  }: Props) => {
    return (
      <CommonTable
        columns={indexPageColumns(
          onInspect,
        )}
        data={data}
        groupBy="batchNo"
      />
    );
  };

export default QualityControlIndexTable;