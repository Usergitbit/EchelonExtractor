import { WorkerRequestType } from ".";

export interface IRequestInformation {
    requestType: WorkerRequestType;
    requestId: number;
    processingUnitId: number;
}