
import type { OrderItem } from "./customerApprovalList.type";

export interface AddCasingToExistingOrderProps {
  existingOrder: OrderItem;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export interface AddCasingResult {
  success: boolean;
  message?: string;
}
  