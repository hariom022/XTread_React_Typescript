import { useRef, useState } from "react";
import Modal from "bootstrap/js/dist/modal";

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

const BuffingStage = () => {
    const [activeTab, setActiveTab] = useState<
        "pre" | "post"
    >("pre");

    const [selectedPreItem, setSelectedPreItem] =
        useState<PreBuffingRow | null>(null);

    const [selectedPostItem, setSelectedPostItem] =
        useState<PostBuffingRow | null>(null);

    const preModalRef =
        useRef<HTMLDivElement>(null);

    const postModalRef =
        useRef<HTMLDivElement>(null);

    /* ==================================
          PRE BUFFING TABLE
    =================================== */

    const {
        filteredData: preBuffingRows,
        fetchPreBuffingOrders,
    } = usePreBuffingIndexTable();

    /* ==================================
          POST BUFFING TABLE
    =================================== */

    const {
        filteredData: postBuffingRows,
        fetchPostBuffingOrders,
    } = usePostBuffingIndexTable();

    /* ==================================
          PRE APPROVAL HOOK
    =================================== */

    const preApproval =
        usePreBuffingApproveModal({
            selectedItem: selectedPreItem,
            refreshTable: fetchPreBuffingOrders,
        });

    /* ==================================
          POST APPROVAL HOOK
    =================================== */

    const postApproval =
        usePostBuffingApproveModal({
            selectedItem: selectedPostItem,
            refreshTable: fetchPostBuffingOrders,
        });

    /* ==================================
          OPEN PRE MODAL
    =================================== */

    const openPreApprovalModal = async (
        item: PreBuffingRow
    ) => {
        setSelectedPreItem(item);

        await buffingStageServiceApi.getSuggestedPatterns(
            item.id
        );

        if (preModalRef.current) {
            new Modal(
                preModalRef.current
            ).show();
        }
    };

    /* ==================================
          OPEN POST MODAL
    =================================== */

    const openPostApprovalModal =
        async (
            item: PostBuffingRow
        ) => {
            setSelectedPostItem(item);

            if (item.treadPatternId) {
                await buffingStageServiceApi.getPatternVariants(
                    item.treadPatternId
                );
            }

            if (postModalRef.current) {
                new Modal(
                    postModalRef.current
                ).show();
            }
        };

    return (
        <div className="container-fluid">

            {/* TABS */}

            <div className="d-flex gap-2 mb-3">

                <button
                    className={`btn ${activeTab === "pre"
                        ? "btn-primary"
                        : "btn-outline-primary"
                        }`}
                    onClick={() =>
                        setActiveTab("pre")
                    }
                >
                    PRE BUFFING
                </button>

                <button
                    className={`btn ${activeTab === "post"
                        ? "btn-primary"
                        : "btn-outline-primary"
                        }`}
                    onClick={() =>
                        setActiveTab("post")
                    }
                >
                    POST BUFFING
                </button>

            </div>

            {/* TABLES */}

            {activeTab === "pre" && (
                <PreBuffingTable
                    data={preBuffingRows}
                    onApprove={
                        openPreApprovalModal
                    }
                />
            )}

            {activeTab === "post" && (
                <PostBuffingTable
                    data={postBuffingRows}
                    onApprove={
                        openPostApprovalModal
                    }
                />
            )}

            {/* ==========================
          PRE BUFFING MODAL
      ========================== */}

            {selectedPreItem && (
                <PreBuffingApprovalModal
                    approvalModalRef={
                        preModalRef
                    }
                    selected={
                        selectedPreItem
                    }
                    {...preApproval}
                />
            )}

            {/* ==========================
          POST BUFFING MODAL
      ========================== */}

            {selectedPostItem && (
                <PostBuffingApprovalModal
                    postBuffingModalRef={
                        postModalRef
                    }
                    selectedItem={
                        selectedPostItem
                    }
                    {...postApproval}
                />
            )}

        </div>
    );
};

export default BuffingStage;