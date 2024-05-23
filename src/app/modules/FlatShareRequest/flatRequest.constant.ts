import { RequestStatus } from "@prisma/client";

export interface TFlatShareRequestStatus {
    requestId: string;
    status: RequestStatus;
    userId: string;
}