import {CustomError} from "./CustomError";

export const AUTHENT_HEADER = "Authentication";
export const BEARER = "Bearer ";

export interface User {
    user_id: number;
    username: string;
    email?: string;
    password: string;
    last_login?: string;
    external_id?: string;
}

export interface Session {
    token: string;
    username?: string;
    id?: number;
    externalId: string;
}


export interface EmptyCallback {
    (): void;
}

export interface SessionCallback {
    (session: Session): void;
}


export interface ErrorCallback {
    (error: CustomError): void;
}

export interface Account {
    username: string;
    email: string;
    password: string;
}

export interface UserInfo {
    user_id: string;
    username: string;
    last_login:string;
}
export interface SalonInfo {
    room_id: string;
    name: string;
    created_on:string;
    created_by:string;
}
export interface Message {
    message_id: number;
    sender_id: string;
    receiver_id: string;
    content: string;
    formatted_timestamp: string;
    message_type?: string ;
}