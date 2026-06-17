import { useEffect,useState,} from "react";

import qualityControlServiceApi from "../service/qualityControlServiceApi";

import type {QualityControlRow,} from "../type/qualityControl.type";
import indexPageApiService from "../../../shared/services/indexPageApiService";

const useQualityControlIndexTable =
    () => {

        const [
            loading,
            setLoading,
        ] = useState(false);

        const [
            rows,
            setRows,
        ] = useState<
            QualityControlRow[]
        >([]);

        const fetchRows =
            async () => {
                try {

                    setLoading(true);

                    const response =
                    await indexPageApiService.getBatchProgress(15,1);
                    const stage =
                        response.data.data?.[0];

                    const data =
                        stage?.batches?.flatMap(
                            (batch: any) =>
                                batch.casings.map(
                                    (casing: any) => ({
                                        ...casing,

                                        batchNumber:
                                            batch.batchNumber,
                                    }),
                                ),
                        ) || [];

                    setRows(data);

                } catch (error) {

                    console.error(error);

                } finally {

                    setLoading(false);
                }
            };

        useEffect(() => {
            fetchRows();
        }, []);

        return {
            rows,
            loading,
            fetchRows,
        };
    };

export default
    useQualityControlIndexTable;