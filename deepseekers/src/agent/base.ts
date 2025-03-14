import { DeepSeekClient,Client } from "../client";
import { HumanMessage,SystemMessage } from "../message";
import { DeepseekResult, Result } from "../result";
import { functionToJsonSchema } from "../utils";
type Dict<T> = { [key: string]: T };
import { BaseMessage } from "../message";
import { LLMWriter } from "../types";
export default class Agent<D,T extends LLMWriter>{
    name:string;
    client:Client;
    modelName:string;
    tools:any;
    toolMap:{[key:string]:Function};
    resultType?:T | null;
    // dep:D|null;
    systemMessage: any | SystemMessage
    messages:BaseMessage[]
    constructor(
        name:string,
        resultType:T|null,
        // dep:D|null,
        systemMessage:any |SystemMessage|null = null,
        client:Client = new DeepSeekClient(name="deepseek-client"),
        modelName: string = 'deepseek-chat',
    ){
        this.name = name;
        this.client = client;
        this.modelName = modelName;
        this.tools = [];
        this.toolMap = {};
        this.resultType = resultType;
        // this.dep = dep;

        this.systemMessage = {
            role:"system",
            content:`${systemMessage} ${resultType?.example()}`
        } as SystemMessage

        this.messages = [this.systemMessage]
    }

    reset():void{
        this.systemMessage = {role:"system",content:"you are very help assistant"};
        this.messages = [this.systemMessage];
        this.tools = [];
    }
    updateSystemMessage(message:any):void{
        this.systemMessage = message;
        this.messages[0] = this.systemMessage;
    }

    // tool(func:any):any{
    //     return(...args:any[])=>{
    //         func(...args)
    //     }
    // }
    bindTool(tool:any):void{
        const functionNameRegex = /function\s+(\w+)\s*\(/;
        
        if (typeof tool === 'function'){
            const code = tool.toString()
            const parsedTool = functionToJsonSchema(code)
            const functionNameMatch = code.match(functionNameRegex);
            
            const functionName = functionNameMatch ? functionNameMatch[1] : 'anonymous';
          
            this.tools.push(parsedTool)
            this.toolMap[functionName] = tool;
        }
        
    }

    addMessage(message:BaseMessage|any){
        this.messages.push(message);
    }

    async run(query: string | HumanMessage, deps: any):Promise<DeepseekResult<T>>{
        let humanMessage;
        if(typeof query === 'string'){
             humanMessage = {role:'user',content:query} as HumanMessage;
        }else{
            humanMessage = query as HumanMessage
        }
        this.messages.push(humanMessage);

        const response = await this.client.chat({
            messages:this.messages,
            model: 'deepseek-chat',
            ...(this.tools.length > 0 && { tools: this.tools })
            
        });
        // console.log(response.choices[0].message)
        // console.log(response.choices[0].message.tool_calls)
        // console.log(response.choices[0].message.tool_calls.function)
        const result = new DeepseekResult<T>(response,[],this.resultType);
        return result
    }
}