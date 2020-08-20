import { IRequestInformation } from ".";

export interface IWorkerRequestMessageData {
    payload?: ImageData;
    requestInformation: IRequestInformation;
}