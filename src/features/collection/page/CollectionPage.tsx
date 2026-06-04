// src/features/collection/page/CollectionPage.tsx

import { useEffect, useMemo, useState } from "react";

import "../styles/Collection.css";

import CustomerSelection from "../components/CustomerSelection";

import OrderDetails from "../components/OrderDetails";

import OrderTable from "../components/OrderTable";

import RetreadForm from "../components/forms/RetreadForm";

import RepairForm from "../components/forms/RepairForm";

import ClaimForm from "../components/forms/ClaimForm";

// import customerService from "../services/customerService";
import useCustomers from "../hooks/useCustomers";

import masterService from "../services/masterService";
import { useTyreSizes } from "../hooks/useTyreSizes";

import { usePatterns } from "../hooks/usePatterns";

import type {
  Category,
  Customer,
  Pattern,
  RimSize,
  ServiceType,
  TyreMake,
  TyreSize,
} from "../types/collection.types";
import { RingLoader } from "react-spinners";

type Props = {
  editMode?: boolean;
  casing?: any;
  onClose?: () => void;
  onSuccess?: () => void;
  hideLayout?: boolean;
  setSaveEditLoading?: (loading: boolean) => void;
};

const CollectionPage = ({
  editMode = false,
  casing,
  onClose,
  onSuccess,
  hideLayout = false,
  setSaveEditLoading,
}: Props) => {
  // =========================================================
  // CUSTOMER
  // =========================================================

  // const [customers, setCustomers] =
  //   useState<Customer[]>([]);

  const { customers, loading, error } = useCustomers();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  // =========================================================
  // SERVICE
  // =========================================================

  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);

  const [serviceTypeId, setServiceTypeId] = useState<string>("");

  // =========================================================
  // CATEGORY
  // =========================================================

  const [categories, setCategories] = useState<Category[]>([]);

  const [category, setCategory] = useState<Category | null>(null);

  const [selectedTyreName, setSelectedTyreName] = useState<string>("");

  // =========================================================
  // MAKE
  // =========================================================

  const [make, setMake] = useState<TyreMake[]>([]);

  const [selectedMake, setSelectedMake] = useState<string | null>(null);

  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const [search, setSearch] = useState<string>("");

  const [tyreClass, setTyreClass] = useState<string>("");

  const [tyreMakeId, setTyreMakeId] = useState<number>(0);

  const [tyreClassificationId, setTyreClassificationId] = useState<number>(0);

  // =========================================================
  // COMMON FIELDS
  // =========================================================

  const [model, setModel] = useState<string>("");

  const [serial, setSerial] = useState<string>("");

  const [dot, setDot] = useState<string>("");

  const [otherNumber, setOtherNumber] = useState<string>("");

  const [vehicleReg, setVehicleReg] = useState<string>("");

  const [noOfRepairs, setNoOfRepairs] = useState<string>("");

  // =========================================================
  // RETREAD
  // =========================================================

  const [isRetreaded, setIsRetreaded] = useState<boolean>(false);

  const [noOfRetreads, setNoOfRetreads] = useState<string>("");

  const [previousPattern, setPreviousPattern] = useState<string>("");

  const [retreadRef, setRetreadRef] = useState<string>("");

  // =========================================================
  // PATTERN
  // =========================================================

  const [override, setOverride] = useState<boolean>(false);

  // =========================================================
  // REPAIR
  // =========================================================

  const [remainingTreadDepth, setRemainingTreadDepth] = useState<string>("");

  const [remarks, setRemarks] = useState<string>("");

  const [repairType, setRepairType] = useState<string>("");

  const [repairLocation, setRepairLocation] = useState<string>("");

  const [repairQty, setRepairQty] = useState<string>("");

  const [repairs, setRepairs] = useState<any[]>([]);

  // =========================================================
  // CLAIM
  // =========================================================

  const [images, setImages] = useState<any[]>([]);

  const [showPreview, setShowPreview] = useState<boolean>(false);

  const [selectedImage, setSelectedImage] = useState<any>(null);

  const [patternMismatch, setPatternMismatch] = useState<boolean>(false);

  const [showRejectMessage, setShowRejectMessage] = useState<boolean>(false);

  const [orderNumber, setOrderNumber] = useState<string>("");
  // =========================
  // ADD THESE STATES
  // =========================

  // TYRE HISTORY
  const [showTyreHistory, setShowTyreHistory] = useState<boolean>(false);

  const {
    rimSizes,
    selectedRimSize,
    setSelectedRimSize,

    tyreSizes,
    tyreSize,
    setTyreSize,

    loadRimSizes,
  } = useTyreSizes(category?.categoryId);

  const {
    patterns,
    widths,

    selectedPattern,
    setSelectedPattern,

    selectedPatternObj,
    setSelectedPatternObj,

    selectedWidth,
    setSelectedWidth,

    selectedVariantId,
    setSelectedVariantId,

    brand,
    setBrand,

    patternClass,
    setPatternClass,

    handlePatternChange,
  } = usePatterns(
    category?.categoryId,
    tyreClassificationId,
    isRetreaded,
    override,
  );
  const tyreHistoryList = [
    {
      invoiceDate: "01/12/2024",
      invoiceNo: "INV-1023",
      invoiceAmount: "12500",
      previousPattern: "A100",
      repairMaterial: "Rubber",
      serviceType: "Retread",
    },

    {
      invoiceDate: "08/10/2023",
      invoiceNo: "INV-0987",
      invoiceAmount: "9800",
      previousPattern: "A102",
      repairMaterial: "Compound",
      serviceType: "Repair",
    },

    {
      invoiceDate: "14/05/2023",
      invoiceNo: "INV-0756",
      invoiceAmount: "10200",
      previousPattern: "A103",
      repairMaterial: "Rubber",
      serviceType: "Retread",
    },
  ];

  // CLAIM EXTRA
  const [claimType, setClaimType] = useState<string>("");

  const [currentPattern, setCurrentPattern] = useState<string>("");

  const [originalTreadDepth, setOriginalTreadDepth] = useState<string>("");

  const [claimRemainingTreadDepth, setClaimRemainingTreadDepth] =
    useState<string>("");

  const [driverName, setDriverName] = useState<string>("");

  const [mileage, setMileage] = useState<string>("");

  const [incidentLocation, setIncidentLocation] = useState<string>("");

  const [axlePosition, setAxlePosition] = useState<string>("");

  const [productionDate, setProductionDate] = useState<string>("");

  const [manifestation, setManifestation] = useState<string>("");

  const [suggestedAction, setSuggestedAction] = useState<string>("");

  const [claimStatus, setClaimStatus] = useState<string>("");

  const [claimRemarks, setClaimRemarks] = useState<string>("");

  const [rejectedPatternNo, setRejectedPatternNo] = useState<string>("");

  // =========================================================
  // TABLE
  // =========================================================

  const [orderItems, setOrderItems] = useState<any[]>([]);

  // =========================================================
  // LOAD INITIAL
  // =========================================================

  useEffect(() => {
    // loadCustomers();

    loadServiceTypes();

    loadTyreMakes();
  }, []);

  // =========================================================
  // LOADERS
  // =========================================================

  const loadServiceTypes = async () => {
    const res = await masterService.getServiceTypes();

    setServiceTypes(res.data.data || []);
  };

  const loadTyreMakes = async () => {
    const res = await masterService.getTyreMakes();

    setMake(res.data.data || []);
  };

  //======================= EDIT ============================

  useEffect(() => {
    const loadEditData = async () => {
      if (!editMode || !casing) return;

      console.log("EDIT CASING", casing);

      // SERVICE TYPE
      if (casing.serviceType?.id) {
        const serviceId = casing.serviceType.id.toString();

        setServiceTypeId(serviceId);

        const catRes = await masterService.getCategories(serviceId);

        const categories = catRes.data.data || [];

        setCategories(categories);

        const selectedCategory = categories.find(
          (x: any) => x.categoryId === casing.category?.categoryId,
        );

        setCategory(selectedCategory || null);

        if (selectedCategory) {
          await loadRimSizes(selectedCategory.categoryId);
        }
      }
      if (casing.orderNumber) {
        setOrderNumber(casing.orderNumber);
      }
      if (casing.retreadDetail) {
        setSelectedPattern(casing.retreadDetail.patternName || "");

        setSelectedWidth(casing.retreadDetail.width?.toString() || "");

        setOverride(casing.retreadDetail.isPatternOverride || false);

        setSelectedVariantId(casing.retreadDetail.treadPatternVariantId || 0);
      }
      // COMMON
      setSerial(casing.tyreReferenceNumber || "");
      setDot(casing.dotNumber || "");
      setOtherNumber(casing.otherNumber || "");
      setVehicleReg(casing.vehicleRegistrationNumber || "");
      setModel(casing.model || "");

      setNoOfRepairs(casing.existingRepairsCount?.toString() || "");

      // RETREAD
      setIsRetreaded(Boolean(casing.isRetreaded));

      setNoOfRetreads(casing.noOfRetread?.toString() || "");

      setPreviousPattern(casing.previousPattern || "");

      setRetreadRef(casing.previousRetreader || "");

      // MAKE
      if (casing.tyreMake) {
        setSelectedMake(casing.tyreMake.name);

        setTyreMakeId(casing.tyreMake.id);

        setTyreClassificationId(casing.tyreClassification?.id || 0);

        setTyreClass(casing.tyreClassification?.name || "");
      }

      // RIM
      setSelectedRimSize(casing.rimSize?.toString() || "");

      // TYRE SIZE
      setTyreSize(casing.tyreSize?.tyreSizeId?.toString() || "");

      setSelectedTyreName(casing.tyreSize?.casingSize || "");

      // PATTERN
      if (casing.retreadDetail) {
        setSelectedPattern(casing.retreadDetail.patternName || "");

        setSelectedWidth(casing.retreadDetail.width?.toString() || "");

        setOverride(casing.retreadDetail.isPatternOverride || false);
      }
      if (casing.repairDetail) {
        setRemainingTreadDepth(
          casing.repairDetail.percentageRemainingTreadDepth?.toString() || "",
        );

        setRemarks(casing.repairDetail.remarks || "");

        setRepairs(
          (casing.repairDetail.operations || []).map(
            (x: any, index: number) => ({
              id: index + 1,
              repairType: x.repairType,
              repairLocation: x.repairLocation,
              repairQty: x.quantity?.toString() || "",
            }),
          ),
        );
      }
      if (casing.retreadDetail) {
        setSelectedPattern(casing.retreadDetail.patternName || "");

        setSelectedWidth(casing.retreadDetail.width?.toString() || "");
      }
    };

    loadEditData();
  }, [editMode, casing]);

  useEffect(() => {
    if (!selectedPattern || patterns.length === 0) return;

    const pattern = patterns.find((p) => p.patternName === selectedPattern);

    if (!pattern) return;

    setSelectedPatternObj(pattern);
    setBrand(pattern.brand);
    setPatternClass(pattern.tyreClassificationName);

    if (selectedWidth) {
      const variant = pattern.variants?.find(
        (v) => String(v.width) === String(selectedWidth),
      );

      if (variant) {
        setSelectedVariantId(variant.treadPatternVariantId);
      }
    }
  }, [patterns, selectedPattern]);
  // ==========================================================
  // =========================================================
  // SERVICE TYPE CHANGE
  // =========================================================

  const handleServiceTypeChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedId = e.target.value;

    setServiceTypeId(selectedId);

    // RESET
    setCategory(null);

    setCategories([]);

    resetFormFields();

    const res = await masterService.getCategories(selectedId);

    setCategories(res.data.data || []);
  };

  // =========================================================
  // CATEGORY CHANGE
  // =========================================================

  // =========================
  // UPDATE CATEGORY CHANGE
  // =========================

  const handleCategoryChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selected = categories.find(
      (c) => c.categoryId === Number(e.target.value),
    );

    setCategory(selected || null);

    // RESET FORM
    resetFormFields();

    if (!selected) return;

    // const rimResponse = await masterService.getRimSizes(selected.categoryId);

    // setRimSizes(rimResponse.data.data || []);

    await loadRimSizes(selected.categoryId);
  };

  // =========================================================
  // FILTERED MAKE
  // =========================================================

  const filteredMake = useMemo(() => {
    return make.filter((m) =>
      m.tyreMakeName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [make, search]);

  // =========================================================
  // MAKE SELECT
  // =========================================================

  const handleMakeSelect = (selectedMakeObj: TyreMake) => {
    setSelectedMake(selectedMakeObj.tyreMakeName);

    setTyreMakeId(selectedMakeObj.tyreMakeId);

    setTyreClassificationId(selectedMakeObj.tyreClassificationId);

    setTyreClass(selectedMakeObj.tyreClassificationName);

    // reset pattern fields
    setSelectedPattern("");

    // setSelectedPatternObj(null);

    setSelectedWidth("");

    // setBrand("");

    // setPatternClass("");

    // setWidths([]);
  };

  // =========================================================
  // SELECTED SERVICE NAME
  // =========================================================

  const selectedService =
    serviceTypes.find((x) => x.serviceTypeId.toString() === serviceTypeId)
      ?.serviceTypeName || "";

  // =========================================================
  // ADD CASING
  // =========================================================

  // =========================
  // UPDATE handleAddCasing
  // =========================

  const handleAddCasing = () => {
    const payload = {
      id: Date.now(),

      // DISPLAY
      serviceType: selectedService,

      category: category?.categoryName || "",

      tyreSize: selectedTyreName,
      tyreSizeId: tyreSize,

      serial,

      dot,

      make: selectedMake || "",

      pattern: selectedPattern,

      width: selectedWidth,

      // IDS
      serviceTypeId: serviceTypeId,

      categoryId: category?.categoryId,

      tyreMakeId,

      tyreClassificationId,

      treadPatternVariantId: selectedVariantId,

      // COMMON
      rimSize: selectedRimSize,

      model,

      tyreClass,

      noOfRepairs,

      noOfRetreads,

      isRetreaded,

      previousPattern,

      override,

      retreadRef,

      otherNumber,

      vehicleReg,

      // REPAIR
      repairs,

      remainingTreadDepth,

      remarks,

      // CLAIM
      claimType,

      currentPattern,

      originalTreadDepth,

      claimRemainingTreadDepth,

      driverName,

      mileage,

      incidentLocation,

      axlePosition,

      productionDate,

      manifestation,

      suggestedAction,

      claimStatus,

      claimRemarks,

      rejectedPatternNo,

      images,
    };

    console.log("payload", payload);

    setOrderItems((prev) => [...prev, payload]);

    resetFormFields();
  };

  const handleAddRepair = () => {
    if (!repairType || !repairLocation || !repairQty) {
      alert("Please fill all repair fields");
      return;
    }

    setRepairs((prev) => [
      ...prev,
      {
        id: Date.now(),
        repairType,
        repairLocation,
        repairQty,
      },
    ]);

    setRepairType("");
    setRepairLocation("");
    setRepairQty("");
  };

  const handleDeleteRepair = (id: number) => {
    setRepairs((prev) => prev.filter((r) => r.id !== id));
  };

  // =========================
  // ADD THIS FUNCTION
  // =========================

  const resetFormFields = () => {
    setSelectedRimSize("");
    setTyreSize("");

    setSelectedMake(null);

    setTyreMakeId(0);

    setTyreClassificationId(0);

    setModel("");

    setTyreClass("");

    setSerial("");

    setDot("");

    setOtherNumber("");

    setVehicleReg("");

    setNoOfRepairs("");

    setNoOfRetreads("");

    setIsRetreaded(false);

    setPreviousPattern("");

    setRetreadRef("");

    setOverride(false);

    setSelectedPattern("");

    // setSelectedPatternObj(null);

    setSelectedWidth("");

    // setBrand("");

    // setPatternClass("");

    setRemainingTreadDepth("");

    setRemarks("");

    setRepairs([]);

    setRepairType("");

    setRepairLocation("");

    setRepairQty("");

    setSearch("");

    setShowDropdown(false);

    // CLAIM RESET
    setImages([]);

    setShowPreview(false);

    setSelectedImage(null);

    setPatternMismatch(false);

    setShowRejectMessage(false);

    setClaimType("");

    setCurrentPattern("");

    setOriginalTreadDepth("");

    setClaimRemainingTreadDepth("");

    setDriverName("");

    setMileage("");

    setIncidentLocation("");

    setAxlePosition("");

    setProductionDate("");

    setManifestation("");

    setSuggestedAction("");

    setClaimStatus("");

    setClaimRemarks("");

    setRejectedPatternNo("");
  };

  // =========================================================
  // BUILD API PAYLOAD
  // =========================================================

  const buildApiPayload = () => {
    return {
      customerNumber: selectedCustomer?.customerNumber,

      casings: orderItems.map((item) => ({
        serviceTypeId: item.serviceTypeId?.toString(),

        categoryId: item.categoryId?.toString(),

        tyreSizeId: item.tyreSizeId?.toString(),

        rimSize: item.rimSize,

        tyreMakeId: item.tyreMakeId?.toString(),

        model: item.model,

        tyreClassificationId: item.tyreClassificationId?.toString(),

        tyreReferenceNumber: item.serial,

        dotNumber: item.dot,

        otherNumber: item.otherNumber,

        vehicleRegistrationNumber: item.vehicleReg,

        existingRepairsCount: item.noOfRepairs || "0",

        // RETREAD
        isRetreaded: !!item.isRetreaded,

        noOfRetread: item.isRetreaded ? item.noOfRetreads?.toString() : null,

        previousPattern: item.isRetreaded ? item.previousPattern : null,

        previousRetreader: item.isRetreaded ? item.retreadRef : null,

        // RETREAD DETAIL
        retreadDetail:
          item.serviceType === "Retread"
            ? {
                treadPatternVariantId: item.treadPatternVariantId?.toString(),

                isPatternOverride: !!item.override,
              }
            : null,

        // REPAIR DETAIL
        repairDetail:
          item.serviceType === "Repair"
            ? {
                percentageRemainingTreadDepth: item.remainingTreadDepth || "0",

                remarks: item.remarks || "",

                operations:
                  item.repairs?.map((r: any) => ({
                    repairType: r.repairType,

                    repairLocation: r.repairLocation,

                    quantity: r.repairQty,
                  })) || [],
              }
            : null,
      })),
    };
  };
  // =========================================================
  // SAVE ORDER
  // =========================================================
  const [saveOrderLoading, setSaveOrderLoading] = useState(false);
  const handleSaveOrder = async () => {
    try {
      if (orderItems.length === 0) {
        alert("Please add casing first");

        return;
      }
      setSaveOrderLoading(true);
      // ==================================
      // ADD CASING TO EXISTING ORDER
      // ==================================

      if (orderNumber && orderNumber.trim() !== "") {
        const lastItem = orderItems[orderItems.length - 1];

        const casingPayload = {
          serviceTypeId: lastItem.serviceTypeId?.toString(),

          categoryId: lastItem.categoryId?.toString(),

          tyreSizeId: lastItem.tyreSizeId?.toString(),

          rimSize: lastItem.rimSize,

          tyreMakeId: lastItem.tyreMakeId?.toString(),

          model: lastItem.model,

          tyreClassificationId: lastItem.tyreClassificationId?.toString(),

          tyreReferenceNumber: lastItem.serial,

          dotNumber: lastItem.dot,

          otherNumber: lastItem.otherNumber,

          vehicleRegistrationNumber: lastItem.vehicleReg,

          existingRepairsCount: lastItem.noOfRepairs || "0",

          isRetreaded: !!lastItem.isRetreaded,

          noOfRetread: lastItem.isRetreaded
            ? lastItem.noOfRetreads?.toString()
            : null,

          previousPattern: lastItem.isRetreaded
            ? lastItem.previousPattern
            : null,

          previousRetreader: lastItem.isRetreaded ? lastItem.retreadRef : null,

          // RETREAD
          retreadDetail:
            lastItem.serviceType === "Retread"
              ? {
                  treadPatternVariantId:
                    lastItem.treadPatternVariantId?.toString(),

                  isPatternOverride: !!lastItem.override,
                }
              : null,

          // REPAIR
          repairDetail:
            lastItem.serviceType === "Repair"
              ? {
                  percentageRemainingTreadDepth:
                    lastItem.remainingTreadDepth || "0",

                  remarks: lastItem.remarks || "",

                  operations:
                    lastItem.repairs?.map((r: any) => ({
                      repairType: r.repairType,

                      repairLocation: r.repairLocation,

                      quantity: r.repairQty,
                    })) || [],
                }
              : null,
        };

        console.log("ADD CASING API", casingPayload);

        await masterService.addCasingToOrder(orderNumber, casingPayload);

        alert("Casing added successfully ✅");

        setOrderItems([]);
      }

      // ==================================
      // CREATE NEW ORDER
      // ==================================
      else {
        const payload = buildApiPayload();

        console.log("CREATE ORDER API", payload);

        await masterService.postSaveOrder(payload);

        alert("Order created successfully ✅");

        setOrderItems([]);

        resetFormFields();
      }
    } catch (err) {
      console.error("SAVE ORDER ERROR", err);

      alert("Error saving order ❌");
    } finally {
      setSaveOrderLoading(false);
    }
  };

  //===================SAVE EDIT FORM =======================================
  const handleUpdateCasing = async () => {
    try {
      setSaveEditLoading?.(true);
      const payload = {
        serviceTypeId: serviceTypeId,
        categoryId: category?.categoryId,

        tyreSizeId: tyreSize,

        rimSize: selectedRimSize,

        tyreMakeId: tyreMakeId,

        model,

        tyreClassificationId,

        tyreReferenceNumber: serial,

        dotNumber: dot,

        otherNumber: otherNumber,

        vehicleRegistrationNumber: vehicleReg,

        existingRepairsCount: noOfRepairs,

        isRetreaded,

        noOfRetread: isRetreaded ? noOfRetreads : null,

        previousPattern: isRetreaded ? previousPattern : null,

        previousRetreader: isRetreaded ? retreadRef : null,

        retreadDetail:
          selectedService === "Retread"
            ? {
                treadPatternVariantId: selectedVariantId,
                isPatternOverride: override,
              }
            : null,

        repairDetail:
          selectedService === "Repair"
            ? {
                percentageRemainingTreadDepth: remainingTreadDepth,

                remarks,

                operations: repairs.map((r) => ({
                  repairType: r.repairType,
                  repairLocation: r.repairLocation,
                  quantity: Number(r.repairQty),
                })),
              }
            : null,
      };
      console.log("UPDATE PAYLOAD ON EDITING ", payload);
      await masterService.updateOrderCasing(
        casing.orderNumber,
        casing.orderCasingId,
        payload,
      );

      alert("Casing updated successfully");

      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert("Failed to update casing");
    } finally {
      setSaveEditLoading?.(false);
    }
  };

  //========================================================================
  return (
    <div className="container-fluid modern-form p-3">
      {/* TOP SECTION */}
      {!hideLayout && (
        <div className="row g-4">
          <div className="col-lg-6">
            <CustomerSelection
              customers={customers}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              orderItemsLength={orderItems.length}
            />
          </div>

          <div className="col-lg-6">
            <OrderDetails
              serviceTypes={serviceTypes}
              selectedServiceType={serviceTypeId}
              handleServiceTypeChange={handleServiceTypeChange}
              categories={categories}
              category={category?.categoryId || 0}
              handleCategoryChange={handleCategoryChange}
              orderNumber={orderNumber}
              setOrderNumber={setOrderNumber}
            />
          </div>
        </div>
      )}

      {/* RETREAD */}
      {selectedService === "Retread" && category && (
        <div className="card modern-card mt-4">
          <div className="card-header modern-header">
            {category?.categoryName} Retread
          </div>

          <div className="card-body">
            <RetreadForm
              handleMakeSelect={handleMakeSelect}
              selectedRimSize={selectedRimSize}
              setSelectedRimSize={setSelectedRimSize}
              tyreSize={tyreSize}
              setTyreSize={setTyreSize}
              tyreSizes={tyreSizes}
              rimSizes={rimSizes}
              selectedTyreName={selectedTyreName}
              setSelectedTyreName={setSelectedTyreName}
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              make={make}
              filteredMake={filteredMake}
              search={search}
              setSearch={setSearch}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setTyreClass={setTyreClass}
              setTyreMakeId={setTyreMakeId}
              tyreClassificationId={tyreClassificationId}
              setTyreClassificationId={setTyreClassificationId}
              model={model}
              setModel={setModel}
              tyreClass={tyreClass}
              serial={serial}
              setSerial={setSerial}
              dot={dot}
              setDot={setDot}
              otherNumber={otherNumber}
              setOtherNumber={setOtherNumber}
              vehicleReg={vehicleReg}
              setVehicleReg={setVehicleReg}
              noOfRepairs={noOfRepairs}
              setNoOfRepairs={setNoOfRepairs}
              isRetreaded={isRetreaded}
              // handleIsRetreadedChange={setIsRetreaded}
              noOfRetreads={noOfRetreads}
              setNoOfRetreads={setNoOfRetreads}
              previousPattern={previousPattern}
              setPreviousPattern={setPreviousPattern}
              retreadRef={retreadRef}
              setRetreadRef={setRetreadRef}
              // showTyreHistory={false}
              // setShowTyreHistory={() => {}}
              // tyreHistoryList={[]}
              override={override}
              setOverride={setOverride}
              // handleOverrideChange={setOverride}
              selectedPattern={selectedPattern}
              handlePatternChange={handlePatternChange}
              patterns={patterns}
              selectedWidth={selectedWidth}
              setSelectedWidth={setSelectedWidth}
              widths={widths}
              selectedPatternObj={selectedPatternObj}
              setSelectedVariantId={setSelectedVariantId}
              brand={brand}
              patternClass={patternClass}
              category={category}
              handleAddCasing={handleAddCasing}
              showTyreHistory={showTyreHistory}
              setShowTyreHistory={setShowTyreHistory}
              tyreHistoryList={tyreHistoryList}
              handleIsRetreadedChange={setIsRetreaded}
              handleOverrideChange={setOverride}
              isEditMode={editMode}
              onSave={handleUpdateCasing}
              onClose={onClose}
            />
          </div>
        </div>
      )}

      {/* REPAIR */}
      {selectedService === "Repair" && category && (
        <div className="card modern-card mt-4">
          <div className="card-header modern-header">
            {category?.categoryName} Repair
          </div>

          <div className="card-body">
            <RepairForm
              selectedRimSize={selectedRimSize}
              setSelectedRimSize={setSelectedRimSize}
              tyreSize={tyreSize}
              setTyreSize={setTyreSize}
              tyreSizes={tyreSizes}
              rimSizes={rimSizes}
              selectedTyreName={selectedTyreName}
              setSelectedTyreName={setSelectedTyreName}
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              filteredMake={filteredMake}
              search={search}
              setSearch={setSearch}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setTyreClass={setTyreClass}
              setTyreMakeId={setTyreMakeId}
              tyreClassificationId={tyreClassificationId}
              setTyreClassificationId={setTyreClassificationId}
              model={model}
              setModel={setModel}
              tyreClass={tyreClass}
              serial={serial}
              setSerial={setSerial}
              dot={dot}
              setDot={setDot}
              otherNumber={otherNumber}
              setOtherNumber={setOtherNumber}
              vehicleReg={vehicleReg}
              setVehicleReg={setVehicleReg}
              noOfRepairs={noOfRepairs}
              setNoOfRepairs={setNoOfRepairs}
              isRetreaded={isRetreaded}
              // handleIsRetreadedChange={setIsRetreaded}
              noOfRetreads={noOfRetreads}
              setNoOfRetreads={setNoOfRetreads}
              previousPattern={previousPattern}
              setPreviousPattern={setPreviousPattern}
              retreadRef={retreadRef}
              setRetreadRef={setRetreadRef}
              // showTyreHistory={false}
              // setShowTyreHistory={() => {}}
              // tyreHistoryList={[]}
              repairType={repairType}
              setRepairType={setRepairType}
              repairLocation={repairLocation}
              setRepairLocation={setRepairLocation}
              repairQty={repairQty}
              setRepairQty={setRepairQty}
              repairs={repairs}
              handleAddRepair={handleAddRepair}
              handleDeleteRepair={handleDeleteRepair}
              remainingTreadDepth={remainingTreadDepth}
              setRemainingTreadDepth={setRemainingTreadDepth}
              remarks={remarks}
              setRemarks={setRemarks}
              category={category}
              handleAddCasing={handleAddCasing}
              showTyreHistory={showTyreHistory}
              setShowTyreHistory={setShowTyreHistory}
              tyreHistoryList={tyreHistoryList}
              handleIsRetreadedChange={setIsRetreaded}
              isEditMode={editMode}
              onSave={handleUpdateCasing}
              onClose={onClose}
            />
          </div>
        </div>
      )}

      {/* CLAIM */}
      {selectedService === "Claims" && category && (
        // =========================
        // UPDATE CLAIM FORM CALL
        // =========================

        <div className="card modern-card mt-4">
          <div className="card-header modern-header">
            {category?.categoryName} Claims
          </div>

          <div className="card-body">
            <ClaimForm
              selectedRimSize={selectedRimSize}
              setSelectedRimSize={setSelectedRimSize}
              tyreSize={tyreSize}
              setTyreSize={setTyreSize}
              tyreSizes={tyreSizes}
              rimSizes={rimSizes}
              selectedTyreName={selectedTyreName}
              setSelectedTyreName={setSelectedTyreName}
              selectedMake={selectedMake}
              setSelectedMake={setSelectedMake}
              filteredMake={filteredMake}
              search={search}
              setSearch={setSearch}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setTyreClass={setTyreClass}
              setTyreMakeId={setTyreMakeId}
              tyreClassificationId={tyreClassificationId}
              setTyreClassificationId={setTyreClassificationId}
              model={model}
              setModel={setModel}
              tyreClass={tyreClass}
              serial={serial}
              setSerial={setSerial}
              dot={dot}
              setDot={setDot}
              otherNumber={otherNumber}
              setOtherNumber={setOtherNumber}
              vehicleReg={vehicleReg}
              setVehicleReg={setVehicleReg}
              // TYRE HISTORY
              showTyreHistory={showTyreHistory}
              setShowTyreHistory={setShowTyreHistory}
              tyreHistoryList={tyreHistoryList}
              // IMAGE
              images={images}
              setImages={setImages}
              showPreview={showPreview}
              setShowPreview={setShowPreview}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              // PATTERN
              patternMismatch={patternMismatch}
              setPatternMismatch={setPatternMismatch}
              showRejectMessage={showRejectMessage}
              setShowRejectMessage={setShowRejectMessage}
              category={category}
              handleAddCasing={handleAddCasing}
              isEditMode={editMode}
              onSave={handleUpdateCasing}
              onClose={onClose}
            />
          </div>
        </div>
      )}

      {/* ORDER TABLE */}
      {!hideLayout && (
        <div className="mt-4">
          <OrderTable
            orderItems={orderItems}
            setOrderItems={setOrderItems}
            handleSaveOrder={handleSaveOrder}
          />
        </div>
      )}
      {/* <!-- Footer Buttons --> */}
      {!hideLayout && (
        <div className="footer-actions">
          <button className="btn btn-secondary">Reset</button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleSaveOrder}
            disabled={saveOrderLoading}
          >
            {saveOrderLoading ? "Saving..." : "Save Customer Order"}
          </button>
        </div>
      )}

      {saveOrderLoading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 99999,
          }}
        >
          <RingLoader color="#b30815" size={80} />
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
