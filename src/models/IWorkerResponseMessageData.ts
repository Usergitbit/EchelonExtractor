import { IResponseInformation } from ".";
import { IResponseContent } from './IResponseContent';

export interface IWorkerResponseMessageData {
    content?: IResponseContent;
    information: IResponseInformation;
}