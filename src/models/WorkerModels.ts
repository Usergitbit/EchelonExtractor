
export interface IWorkerRequestMessageEvent {
    data: IWorkerRequestMessageData;
}

export interface IWorkerResponseMessageEvent {
    data: IWorkerResponseMessageData;
}

export interface IWorkerRequestMessageData {
    payload?: ImageData;
    message: WorkerMessage;
}

export interface IWorkerResponseMessageData {
    payload?: ImageData;
    message: WorkerMessage;
}

export enum WorkerMessage {
    Load,
    LoadCompleted,
    ProcessImage,
    ProcessImageResult
}