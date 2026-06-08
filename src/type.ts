/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// export enum BatchStatus {
//   STABLE = "STABLE",
//   WARNING = "WARNING",
//   IN_QUEUE = "IN_QUEUE"
// }

// export enum ActivityType {
//   PASSED = "PASSED",
//   WARNING = "WARNING",
//   INFO = "INFO"
// }

// export interface Batch {
//   id: string;
//   currentState: string;
//   leadOp: string;
//   status: BatchStatus;
//   pressure: number | null; // null for N/A
//   unitCount: number;
// }

// export interface PipelineStep {
//   id: string;
//   label: string;
//   subLabel: string;
//   val: number;
//   iconName: string; // lucide icon name
//   isCurrent?: boolean;
// }

// export interface Activity {
//   id: string;
//   title: string;
//   description: string;
//   timestamp: string;
//   type: ActivityType;
// }

export interface SidebarItem {
  id: string;
  label: string;
  iconName: string;
}
