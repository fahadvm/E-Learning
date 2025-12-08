export interface Certificate {
  _id: string;
  courseId: {
    _id: string;
    title: string;
  };
  certificateUrl: string;
  certificateNumber: string;
  issuedAt: string;
}

export interface CertificateApiResponse {
  ok: boolean;
  data: {
    certificates: Certificate[];
    totalPages: number;
  };
}
