export enum MessageRole {
    AI = 'assistant',
    Human = 'user',
    System = 'system',
    Tool = 'tool',
    Image = 'image',
    Video = 'video',
    Audio = 'audio',
    Code = 'code',
    Memory = 'memory',
    Thinking = 'thinking',
}

export enum CodeLanguage {
    Python = 'python',
    Clanguage = 'c',
    Javascript = 'javascript',
}

export interface BaseMessage {
    role: MessageRole | string;
    content: string | string[];
}