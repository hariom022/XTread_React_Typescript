import { indexPageColumns } from "../../../shared/constants/indexPageColumns";
export const shearographyColumns = (
  onInspect:(item: any) => void
) => {

    const baseColumns =
        indexPageColumns(onInspect);

    const extraColumns = [
        {
            header: "CasingLife/Retread",
            accessor: "1/5",
        },
    ];

    return [
        ...baseColumns.slice(0, -1),
        ...extraColumns,
        baseColumns[baseColumns.length - 1],
    ];
};