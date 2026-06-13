import CommonTable from "../../../shared/components/CommonTable";

import { indexPageColumns } from "../../../shared/constants/indexPageColumns";

interface Props {
    data: any[];

    onInspect: (item: any) => void;
}

const BuildingIndexTable = ({
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

export default BuildingIndexTable;