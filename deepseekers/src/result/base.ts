import { BaseMessage } from "../message";
export interface Result<T> {
    response: any;
    getMessage(): BaseMessage[];
    getText(): string;
    getData(): T | string | null;
}