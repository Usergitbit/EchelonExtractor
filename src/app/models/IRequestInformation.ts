import { WorkerRequestType } from ".";

export interface IRequestInformation {
    requestType: WorkerRequestType;
    id: number;
}