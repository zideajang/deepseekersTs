import Agent from "../../deepseekers/src/agent/base";
import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';
import { functionToJsonSchema } from "../../deepseekers/src/utils";
import { ToolMessage } from "../../deepseekers/src/message";
import { LLMWriter } from "../../deepseekers/src/types";

// 准备函数
function getWeather(location:string):number{
    /**
     * 获取天气
     * location:string:required:输出城市名称
     * other:string:输出城市名称
     */
    return 25
}

class EmptyLLMriable implements LLMWriter{
    example(): string {
        return ""
    }
    
}


async function main(){
    // 初始化一个 Client 提供调用远程 deepseek 的客户端，扩展其他 LLM 供应商提供的服务
    const deepSeekClient = new DeepSeekClient("demo");
    // 初始化一个 Agent
    const agent = new Agent("weatherForcastAgent",new EmptyLLMriable(),deepSeekClient);
    // agent 绑定函数
    agent.bindTool(getWeather)
    // 运行 agent
    const result = await agent.run("沈阳天气多少度",{});
    const messages = result.getMessage() as ToolMessage[];
    const toolMessage = messages[0] as ToolMessage;

    console.log(`tool name:${toolMessage.tool_name}`);
    console.log(`tool arguments:${toolMessage.tool_arguments}`);
    console.log(`result of ${toolMessage.tool_name}:${agent.toolMap[toolMessage.tool_name](...toolMessage.tool_arguments)}`)

    agent.addMessage({role:'assistant',content:`tool ${toolMessage.tool_name} 返回的结果result of ${toolMessage.tool_name}:${agent.toolMap[toolMessage.tool_name](...toolMessage.tool_arguments)}`});

    const resultAterCallTool = await agent.run("根据调用工具返回结果来回答问题，沈阳天气多少度",{});
    console.log(resultAterCallTool.getText());
    console.log(resultAterCallTool.getText());
}   


main();