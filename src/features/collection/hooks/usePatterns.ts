import { useEffect, useState } from "react";

import masterService from "../services/masterService";

import type {
  Pattern,
} from "../types/collection.types";

export const usePatterns = (
  categoryId?: number,
  tyreClassificationId?: number,
  isRetreaded?: boolean,
  override?: boolean
) => {
  const [patterns, setPatterns] = useState<
    Pattern[]
  >([]);

  const [widths, setWidths] = useState<
    number[]
  >([]);

  const [selectedPattern, setSelectedPattern] =
    useState("");

  const [selectedPatternObj, setSelectedPatternObj] =
    useState<Pattern | null>(null);

  const [selectedWidth, setSelectedWidth] =
    useState("");

  const [selectedVariantId, setSelectedVariantId] =
    useState<number>(0);

  const [brand, setBrand] = useState("");

  const [patternClass, setPatternClass] =
    useState("");

  const loadPatterns = async () => {
    if (!categoryId || !tyreClassificationId)
      return;

    try {
      const res =
        await masterService.getPattern(
          categoryId,
          tyreClassificationId,
          !!isRetreaded,
          !!override
        );

      const data = res.data.data || [];

      setPatterns(data);

      let allWidths: number[] = [];

      data.forEach((pattern: Pattern) => {
        pattern.variants.forEach((v) => {
          allWidths.push(v.width);
        });
      });

      setWidths([...new Set(allWidths)]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPatterns();
  }, [
    categoryId,
    tyreClassificationId,
    isRetreaded,
    override,
  ]);

  const handlePatternChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;

    setSelectedPattern(value);

    const selected = patterns.find(
      (p) => p.patternName === value
    );

    if (!selected) return;

    setSelectedPatternObj(selected);

    setBrand(selected.brand);

    setPatternClass(
      selected.tyreClassificationName
    );

    setWidths(
      selected.variants.map((v) => v.width)
    );
  };

  return {
    patterns,
    widths,

    selectedPattern,
    setSelectedPattern,

    selectedPatternObj,

    selectedWidth,
    setSelectedWidth,

    selectedVariantId,
    setSelectedVariantId,

    brand,
    patternClass,

    handlePatternChange,
  };
};