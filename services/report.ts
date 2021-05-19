export interface ReportBody {
  reportingAccount: string;
  refType: string;
  refId: string;
  reason: string;
  url: string;
}

export interface ReportResponse extends ReportBody {
  createdAt: string;
  id: string;
  reviewId: string | null;
  updatedAt: string;
}
