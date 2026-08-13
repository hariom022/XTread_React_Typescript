import { useRef, useState, useEffect, useMemo } from "react";
import { Modal } from "bootstrap";

import PreBuffingTable from "../components/PreBuffingTable";
import PostBuffingTable from "../components/PostBuffingTable";

import PreBuffingApprovalModal from "../components/PreBuffingApprovalModal";
import PostBuffingApprovalModal from "../components/PostBuffingApprovalModal";

import usePreBuffingIndexTable from "../hooks/usePreBuffingIndexTable";
import usePostBuffingIndexTable from "../hooks/usePostBuffingIndexTable";

import usePreBuffingApproveModal from "../hooks/usePreBuffingApproveModal";
import usePostBuffingApproveModal from "../hooks/usePostBuffingApproveModal";

import type { PreBuffingRow } from "../types/preBuffingTypes";
import type { PostBuffingRow } from "../types/postBuffingTypes";

import "../style/BuffingStage.css";
import buffingStageServiceApi from "../service/buffingStageServiceApi";
import type { OrderCasingDetails } from "../../../shared/types/OrderCasingDetails";
import { RingLoader } from "react-spinners";

import IncidentReportModal from "../../../shared/components/IncidentReportModal";

const BuffingStage = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pre" | "post">("pre");

  const [search, setSearch] = useState("");

  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const [selectedPreItem, setSelectedPreItem] = useState<PreBuffingRow | null>(
    null,
  );
  const [selectedPreCasing, setSelectedPreCasing] =
    useState<OrderCasingDetails | null>(null);

  const [selectedPostCasing, setSelectedPostCasing] =
    useState<OrderCasingDetails | null>(null);

  const [selectedPostItem, setSelectedPostItem] =
    useState<PostBuffingRow | null>(null);

  const preModalRef = useRef<HTMLDivElement>(null);

  const postModalRef = useRef<HTMLDivElement>(null);

  /* ==================================
          PRE BUFFING TABLE
    =================================== */
  const { preBuffingData, fetchPreBuffingOrders } = usePreBuffingIndexTable();

  /* ==================================
          POST BUFFING TABLE
    =================================== */

  const { postBuffingData, fetchPostBuffingOrders } =
    usePostBuffingIndexTable();

  /* ==================================
          PRE APPROVAL HOOK
    =================================== */

  const preApproval = usePreBuffingApproveModal({
    selectedItem: selectedPreItem,

    refreshTable: fetchPreBuffingOrders,
    refreshPostTable: fetchPostBuffingOrders,

    onClose: () => {
      if (preModalRef.current) {
        Modal.getInstance(preModalRef.current)?.hide();
      }

      setSelectedPreItem(null);
      setSelectedPreCasing(null);
    },
  });

  /* ==================================
          POST APPROVAL HOOK
    =================================== */

  const postApproval = usePostBuffingApproveModal({
    selectedItem: selectedPostItem,

    refreshTable: fetchPostBuffingOrders,

    onClose: () => {
      if (postModalRef.current) {
        Modal.getInstance(postModalRef.current)?.hide();
      }

      setSelectedPostItem(null);

      setSelectedPostCasing(null);
    },
  });

  /* ==================================
          OPEN PRE MODAL
    =================================== */

  const openPreApprovalModal = async (item: PreBuffingRow) => {
    try {
      setLoading(true);
      const response = await buffingStageServiceApi.getOrderCasingById(item.id);

      const casing = response.data.data;

      setSelectedPreCasing(casing);

      setSelectedPreItem(item);

      await preApproval.fetchSuggestedPatterns(item.id);

      if (preModalRef.current) {
        new Modal(preModalRef.current).show();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ==================================
          OPEN POST MODAL
    =================================== */

  const openPostApprovalModal = async (item: PostBuffingRow) => {
    try {
      setLoading(true);
      const response = await buffingStageServiceApi.getOrderCasingById(item.id);

      const casing = response.data.data;

      setSelectedPostCasing(casing);

      const updatedItem: PostBuffingRow = {
        ...item,
        tyreMake: casing.tyreMake?.name || "-",
        model: casing.model || "-",
        brand: casing.retreadDetail?.brand || "-",
        width: String(casing.retreadDetail?.width || "-"),
        requestedPattern: casing.retreadDetail?.patternName || "-",
        treadPatternId: casing.retreadDetail?.treadPatternId,
        treadPatternVariantId: casing.retreadDetail?.treadPatternVariantId,
      };

      setSelectedPostItem(updatedItem);

      if (casing.retreadDetail?.treadPatternId) {
        await postApproval.fetchPatternVariants(
          casing.retreadDetail.treadPatternId,
        );
      }

      if (postModalRef.current) {
        new Modal(postModalRef.current).show();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([fetchPreBuffingOrders(), fetchPostBuffingOrders()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredPreBuffingRows = useMemo(() => {
    return preBuffingData.filter((item) =>
      `${item.casing}
         ${item.serial}
         ${item.patternName}
         ${item.customerName}
         ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, preBuffingData]);

  const filteredPostBuffingRows = useMemo(() => {
    return postBuffingData.filter((item) =>
      `${item.casing}
         ${item.serial}
         ${item.patternName}
         ${item.customerName}
         ${item.batchNo}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, postBuffingData]);
  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-md-10">
          <input
            className="form-control"
            placeholder="Search by Production No, Tyre Ref No, Pattern or Batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-2 d-flex justify-content-end">
          <button
            className="btn btn-danger w-100"
            onClick={() => setShowIncidentModal(true)}
          >
            Incident Report
          </button>
        </div>
      </div>
      {/* TABS */}

      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn ${
            activeTab === "pre" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setActiveTab("pre")}
        >
          PRE BUFFING
        </button>

        {/* <button
          className={`btn ${activeTab === "post" ? "btn-primary" : "btn-outline-primary"
            }`}
          onClick={() => setActiveTab("post")}
        >
          POST BUFFING
        </button> */}
        <button
          className={`btn ${
            activeTab === "post" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={async () => {
            setLoading(true);

            try {
              setActiveTab("post");

              await fetchPostBuffingOrders();
            } finally {
              setLoading(false);
            }
          }}
        >
          POST BUFFING
        </button>
      </div>

      {/* TABLES */}

      {activeTab === "pre" && (
        <PreBuffingTable
          data={filteredPreBuffingRows}
          onApprove={openPreApprovalModal}
        />
      )}

      {activeTab === "post" && (
        <PostBuffingTable
          data={filteredPostBuffingRows}
          onApprove={openPostApprovalModal}
        />
      )}

      {/* ==========================
          PRE BUFFING MODAL
      ========================== */}

      {selectedPreItem && (
        <PreBuffingApprovalModal
          approvalModalRef={preModalRef}
          selected={selectedPreItem}
          casingDetails={selectedPreCasing}
          {...preApproval}
        />
      )}

      {/* ==========================
          POST BUFFING MODAL
      ========================== */}

      {selectedPostItem && (
        <PostBuffingApprovalModal
          postBuffingModalRef={postModalRef}
          selectedItem={selectedPostItem}
          casingDetails={selectedPostCasing}
          {...postApproval}
        />
      )}
      {showIncidentModal && (
        <IncidentReportModal onClose={() => setShowIncidentModal(false)} />
      )}

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RingLoader size={80} color="#b30815" />
        </div>
      )}
    </div>
  );
};

export default BuffingStage;
