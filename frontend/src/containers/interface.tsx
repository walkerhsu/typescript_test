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
export interface IStatus {
    type?: string;
    msg?: string;
}
export interface IsingleMsg {
    name: string;
    body: string;
}
export interface IMessage {
    [key: string]: IsingleMsg[];
}
export interface IPayload{
    name?: string; // username
    to?: string; // friend name
    body?: string | IsingleMsg[]; // message body
    type?: string; // status type
    msg?: string; // status message
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


