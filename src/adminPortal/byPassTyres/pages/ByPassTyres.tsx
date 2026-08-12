import { useEffect } from "react";
import ByPassTyreTable from "../components/ByPassTyreTable";
import { useByPassTyres } from "../hooks/useByPassTyres";

const ByPassTyres = () => {
    const {
        filteredData,
        loading,
        search,
        setSearch,
        loadBatchProgress,
        skipStages,
    } = useByPassTyres();

    useEffect(() => {
        loadBatchProgress();
    }, []);

    return (
        <div className="container mt-2">
            {/* SEARCH */}
            <div className="row mb-3 mt-2">

                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

            </div>

            {loading && <p>Loading...</p>}

            {!loading && (
                <ByPassTyreTable
                    data={filteredData}
                    skipStages={skipStages}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default ByPassTyres;