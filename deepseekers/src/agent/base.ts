import { DeepSeekClient,Client } from "../client";
import { HumanMessage } from "../message";
import { DeepseekResult, Result } from "../result";
type Dict<T> = { [key: string]: T };

export default class Agent<D,T>{
    name:string;
    client:Client;
    model_name:string;
    constructor(
        name:string,
        client:Client = new DeepSeekClient(name="deepseek-client"),
        model_name: string = 'deepseek-chat',
        
    ){
        this.name = name;
        this.client = client;
        this.model_name = model_name;
    }

    tool(func:any):any{
        return(...args:any[])=>{
            func(...args)
        }
    }

    async run(query: string | HumanMessage, deps: any):Promise<DeepseekResult<T>>{
        const response = await this.client.chat({
            messages:[{role:"user",content:query}],
            model: 'deepseek-chat',
        });
        const result = new DeepseekResult<T>(response);
        return result
        
    }

}