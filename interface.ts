export interface IStatus {
    type?: string;
    msg?: string;
}
export interface ISingleMsg {
    name: string;
    body: string;
}
export interface IPayload{
    name?: string; // username
    to?: string; // friend name
    body?: string | ISingleMsg[]; // message body
    type?: string; // status type
    msg?: string; // status message
}