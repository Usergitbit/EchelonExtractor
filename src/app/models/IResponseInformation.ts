import { WorkerResponseType } from ".";

export interface IResponseInformation {
    responseType: WorkerResponseType;
    requestId: number;
    message?: string;
}