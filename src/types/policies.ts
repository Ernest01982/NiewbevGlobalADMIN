export interface PolicySettings {
  stockHoldingWeeks: number;
  reorderPointNote: string;
  expiryAlert90Days: boolean;
  expiryAlert60Days: boolean;
  expiryAlert30Days: boolean;
  allowFifoExceptions: boolean;
  fifoExceptionClients: string;
  enableIBT: boolean;
  requireTransferApproval: boolean;
  photoRetentionRawDays: number;
  photoRetentionProofDays: number;
}

export const DEFAULT_POLICIES: PolicySettings = {
  stockHoldingWeeks: 4,
  reorderPointNote: '',
  expiryAlert90Days: true,
  expiryAlert60Days: true,
  expiryAlert30Days: true,
  allowFifoExceptions: false,
  fifoExceptionClients: '',
  enableIBT: false,
  requireTransferApproval: true,
  photoRetentionRawDays: 7,
  photoRetentionProofDays: 30,
};
