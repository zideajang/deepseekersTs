import { BaseMessage,MessageRole,CodeLanguage } from "./base";

export interface ThinkingMessage extends BaseMessage {
    role: MessageRole.Thinking;
}

export interface HumanMessage extends BaseMessage {
    role: MessageRole.Human;
}

export interface SystemMessage extends BaseMessage {
    role: MessageRole.System;
}

export interface AIMessage extends BaseMessage {
    role: MessageRole.AI;
}

export interface ToolMessage extends BaseMessage {
    role: MessageRole.Tool;
    tool_id: any;
    tool_call: any;
    tool_name: string;
    tool_arguments: any;
}

export interface MemoryMessage extends BaseMessage {
    role: MessageRole.Memory | string;
}

export interface ImageMessage extends BaseMessage {
    role: MessageRole.Image;
}

export interface CodeMessage extends BaseMessage {
    role: MessageRole.Code;
    lang: CodeLanguage;
}