
import { BaseMessage, AIMessage, ToolMessage } from '../message'; // 假设 message.ts 包含消息接口
import { Result } from './base';


export class DeepseekResult<T> implements Result<T> {
    response: any;
    messages: BaseMessage[] = [];
    result_type: any; // 可以根据实际情况定义更具体的类型
    result_message: BaseMessage | null;

    constructor(response: any, messages?: BaseMessage[], result_type?: any) {
        this.response = response;
        this.messages = messages || [];
        this.result_type = result_type;
        this.result_message = null

        if (this.response.choices[0].message.content) {
            this.result_message = {
                role: 'assistant',
                content: this.response.choices[0].message.content,
            } as AIMessage;
        } else if (this.response.choices[0].message.tool_calls) {
            const toolCall = this.response.choices[0].message.tool_calls[0];
            this.result_message = {
                role: 'tool',
                tool_call: toolCall,
                tool_id: toolCall.id,
                tool_arguments: toolCall.function.arguments,
                tool_name: toolCall.function.name,
                content: '',
            } as ToolMessage;
        }
        if (this.result_message) {
            this.messages.push(this.result_message);
        }
    }

    get all_messages(): BaseMessage[] {
        return this.messages;
    }

    getMessage(): BaseMessage[] {
        if (this.result_message) {

            return [this.result_message];
        } else {
            return []
        }
    }

    getText(): string {
        return String(this.response.choices[0].message.content);
    }
    //TODO 反射来通过 T 来将返回内容实例化 T 类型的实例
    getData(): T | string | null {
        if (this.result_type) {
            try {
                if (!this.response.choices) {
                    throw new Error('No choices in response');
                }
                const data = JSON.parse(this.response.choices[0].message.content);
                return Object.assign(new this.result_type(), data) as T;
            } catch (e) {
                console.error(`Error getting data: ${e}`);
                return null;
            }
        } else {
            return this.getText();
        }
    }
}

export class ErrorResult implements Result<any> {
    response: any;

    constructor(response: any) {
        this.response = response;
    }

    getMessage(): BaseMessage[] {
        return [{ role: 'assistant', content: this.response } as AIMessage];
    }

    getText(): string {
        return String(this.response);
    }

    getData(): any {
        return this.response;
    }
}