import MaterialConsumptionTable from "../components/MaterialConsumptionTable";
import useMaterialConsumption from "../hooks/useMaterialConsumption";

const MaterialConsumptionPage = () => {
  const {
    data,
    loading,
    error,

    currentPage,
    pageSize,
    totalCount,
    totalPages,

    goToPage,
    changePageSize,
  } = useMaterialConsumption();

  return (
    <MaterialConsumptionTable
      data={data}
      loading={loading}
      error={error}

      currentPage={currentPage}
      pageSize={pageSize}
      totalCount={totalCount}
      totalPages={totalPages}

      onPageChange={goToPage}
      onPageSizeChange={changePageSize}
    />
  );
};

export default MaterialConsumptionPage;