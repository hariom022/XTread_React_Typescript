import { useEffect, useState } from "react";
import { Modal } from "bootstrap";

import skivingStageServiceApi from "../service/skivingStageServiceApi";
import type { SkivingStage1Row } from "../types/skivingStage1.types";
import type { DamageType, RepairLocation } from "../service/skivingStageServiceApi";
import type {
  InspectionRepair,
  SkivingRepair,
  RemovedPatch
} from "../types/skivingStage1.types";
import { getSkivingStage1ErrorMessage } from "../utils/getSkivingStage1ErrorMessage";

interface Machine {
  machineId: number;
  machineName: string;
}

type Repair = SkivingRepair;

interface Props {
  selectedItem: SkivingStage1Row | null;

  refreshTable: () => void;
}

const useSkivingStage1Modal = ({
  selectedItem,
  refreshTable,
}: Props) => {
  const [machines, setMachines] =
    useState<Machine[]>([]);

  const [damageTypes, setDamageTypes] =
    useState<DamageType[]>([]);

  const [repairLocations, setRepairLocations] =
    useState<RepairLocation[]>([]);

  const [skivingStation,
    setSkivingStation] =
    useState("");

  const [remarks,
    setRemarks] =
    useState("");

  const [inspectionData, setInspectionData] = useState<InspectionRepair[]>([]);

  const [skivingRepairs,
    setSkivingRepairs] =
    useState<Repair[]>([]);

  const [newRepair, setNewRepair] = useState<Repair>({
    location: "",
    type: "",
    // repairSource: "New Damage",
  });

  const [removedPatches, setRemovedPatches] =
    useState<RemovedPatch[]>([]);
  /* ======================
   REMOVED PATCHES DATA
======================= */

  const loadRemovedPatches = (
    patches: RemovedPatch[],
  ) => {
    setRemovedPatches(patches || []);
  };

  /* ======================
      FETCH MACHINES
  ======================= */

  const fetchMachines =
    async () => {
      try {
        const response =
          await skivingStageServiceApi.getMachines();

        setMachines(
          response.data.data || [],
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchMachines();
    fetchDamageTypes();
    fetchRepairLocations();
  }, []);

  /*=======================
  FETCH DAMAGE TYPE
  ========================*/
  const fetchDamageTypes =
    async () => {
      try {
        const response =
          await skivingStageServiceApi.getDamageTypes();

        setDamageTypes(
          response.data.data || [],
        );
      } catch (error) {
        console.error(error);
      }
    };

  /*=======================
FETCH REPAIR LOCATIONS
========================*/
  const fetchRepairLocations =
    async () => {
      try {
        const response =
          await skivingStageServiceApi.getRepairLocations();

        setRepairLocations(
          response.data.data || [],
        );
      } catch (error) {
        console.error(error);
      }
    };


  /* ======================
      INSPECTION DATA
  ======================= */

  const loadInspectionData = (
    repairs: InspectionRepair[],
  ) => {
    setInspectionData(
      repairs || [],
    );
  };

  /* ======================
      ADD REPAIR
  ======================= */

  const addRepair = () => {
    if (!newRepair.location || !newRepair.type) {
      alert("Please select all repair fields");
      return;
    }

    setSkivingRepairs((prev) => [
      ...prev,
      {
        ...newRepair,
        // repairSource: "New Damage",
      },
    ]);

    setNewRepair({
      location: "",
      type: "",
      // repairSource: "New Damage",
    });
  };
  /* ======================
      DELETE REPAIR
  ======================= */

  const removeRepair = (
    index: number,
  ) => {
    setSkivingRepairs(
      (
        prev,
      ) =>
        prev.filter(
          (
            _,
            i,
          ) => i !== index,
        ),
    );
  };

  /* ======================
      RESET
  ======================= */

  const resetModal = () => {
    setSkivingStation("");

    setRemarks("");

    setInspectionData([]);

    setSkivingRepairs([]);

    setNewRepair({
      location: "",
      type: "",
      // repairSource: "New Damage",
    });
    setRemovedPatches([]);
  };

  /* ======================
      SAVE
  ======================= */

  const handleSave =
    async () => {
      try {
        if (!selectedItem)
          return;

        if (
          !skivingStation
        ) {
          alert(
            "Please select Skiving Station",
          );

          return;
        }

        const payload =
        {
          orderCasingIds:
            [
              selectedItem.id,
            ],

          isApproved:
            true,

          machineId:
            Number(
              skivingStation,
            ),

          rejectionReasonCode:
            null,
          rejectionReasonId: null,

          repairOperations:
            skivingRepairs.length > 0
              ? skivingRepairs.map(
                (
                  repair,
                ) => ({
                  repairType:
                    repair.type,

                  repairLocation:
                    repair.location,

                  quantity:
                    1,
                }),
              ) : null
        };
        console.log(
          "SKIVING STAGE 1 PAYLOAD",
          JSON.stringify(payload, null, 2),
        );
        await skivingStageServiceApi.saveSkivingStage1(
          payload,
        );

        alert(
          "Skiving Stage 1 Saved Successfully",
        );

        refreshTable();
        /********* HIDE MODAL *********** */
        const modalElement =
          document.querySelector(".modal.show");

        if (modalElement) {
          Modal.getInstance(
            modalElement as Element,
          )?.hide();
        }

        resetModal();
      } catch (error: unknown) {
        console.error("Skiving Stage 1 Save Error:", error);

        alert(
          getSkivingStage1ErrorMessage(
            error,
            "Failed to save Skiving Stage 1.",
          ),
        );
      }
    };

  return {
    machines,

    damageTypes,
    repairLocations,
    skivingStation,
    setSkivingStation,

    remarks,
    setRemarks,

    inspectionData,

    loadInspectionData,

    skivingRepairs,
    setSkivingRepairs,

    newRepair,
    setNewRepair,

    addRepair,
    removeRepair,

    handleSave,

    resetModal,
    removedPatches,
    loadRemovedPatches,
  };
};

export default useSkivingStage1Modal;