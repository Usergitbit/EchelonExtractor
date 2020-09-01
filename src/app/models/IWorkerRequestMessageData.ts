import { IRequestInformation } from ".";
import { IRequestContent } from "./IRequestContent";

export interface IWorkerRequestMessageData {
    content?: IRequestContent;
    information: IRequestInformation;
}