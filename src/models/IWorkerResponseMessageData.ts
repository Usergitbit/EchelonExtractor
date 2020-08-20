import { IResponseInformation } from ".";

export interface IWorkerResponseMessageData {
    payload?: ImageData;
    responseInformation: IResponseInformation;
}