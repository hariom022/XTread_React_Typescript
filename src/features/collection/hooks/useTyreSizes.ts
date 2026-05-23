import { useEffect, useState } from "react";

import masterService from "../services/masterService";

import type {
  RimSize,
  TyreSize,
} from "../types/collection.types";

export const useTyreSizes = (
  categoryId?: number
) => {
  const [rimSizes, setRimSizes] = useState<
    RimSize[]
  >([]);

  const [selectedRimSize, setSelectedRimSize] =
    useState("");

  const [tyreSizes, setTyreSizes] = useState<
    TyreSize[]
  >([]);

  const [tyreSize, setTyreSize] =
    useState("");

  // LOAD RIM SIZES
  const loadRimSizes = async (
  selectedCategoryId: number
) => {
  const res =
    await masterService.getRimSizes(
      selectedCategoryId
    );

  setRimSizes(res.data.data || []);
};

  // LOAD TYRE SIZES
  const loadTyreSizes = async () => {
    if (!categoryId || !selectedRimSize)
      return;

    const res =
      await masterService.getTyreSizes(
        categoryId,
        selectedRimSize
      );

    setTyreSizes(res.data.data || []);
  };

  useEffect(() => {
    loadTyreSizes();
  }, [selectedRimSize]);

  return {
    rimSizes,
    setRimSizes,

    selectedRimSize,
    setSelectedRimSize,

    tyreSizes,
    setTyreSizes,

    tyreSize,
    setTyreSize,

    loadRimSizes,
  };
};