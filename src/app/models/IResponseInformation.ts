import { WorkerResponseType } from ".";

export interface IResponseInformation {
    responseType: WorkerResponseType;
    requestId: number;
    processingUnitId: number;
    message?: string;
}