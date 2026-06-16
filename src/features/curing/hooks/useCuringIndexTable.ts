import { useState } from "react";

import type {
  CuringRow,
} from "../type/curing.types";

const useCuringIndexTable = () => {
  const [
    curingRows,
    setCuringRows,
  ] = useState<CuringRow[]>(
    [],
  );

  return {
    curingRows,
    setCuringRows,
  };
};

export default useCuringIndexTable;