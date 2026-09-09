import MaterialConsumptionTable from "../components/MaterialConsumptionTable";
import useMaterialConsumption from "../hooks/useMaterialConsumption";

const MaterialConsumptionPage = () => {
  const {
    data,
    loading,
    error,
  } = useMaterialConsumption();

  return (
    <MaterialConsumptionTable
      data={data}
      loading={loading}
      error={error}
    />
  );
};

export default MaterialConsumptionPage;