import { useEffect } from "react";
import ByPassTyreTable from "../components/ByPassTyreTable";
import { useByPassTyres } from "../hooks/useByPassTyres";

const ByPassTyres = () => {
    const { data, loading, loadBatchProgress, skipStages } = useByPassTyres();

    useEffect(() => {
        loadBatchProgress();
    }, []);

    return (
        <div className="container mt-1">

            {loading && <p>Loading...</p>}

            {!loading && (
                <ByPassTyreTable
                    data={data}
                    skipStages={skipStages}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default ByPassTyres;