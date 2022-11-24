import {ISingleMsg, IStatus, IPayload} from '../../../interface';
export interface ContextInterface {
    status: IStatus;
    me: string,
    messages: IMessage,
    signedIn: boolean,

    setMe: (name: string) => void,
    setSignedIn: (signedIn: boolean) => void,
    setMessages: (messages: IMessage) => void,
    sendMessage: (name: string, to: string, body: string) => void,
    startChat : (name: string, to: string) => void,
    displayStatus: (s: IStatus) => void,
}

export interface IMessage {
    [key: string]: ISingleMsg[];
}
export interface IData {
    task: string;
    payload: IPayload;
}
export interface IUseChatProps {
    children: JSX.Element;
}

export interface ITask_Payload {
    task: string;
    payload: IPayload;
}


