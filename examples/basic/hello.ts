import Agent from "../../deepseekers/src/agent/base";
import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';
import { LLMWriter } from "../../deepseekers/src/types";
class EmptyLLMriable implements LLMWriter{
    example(): string {
        return ""
    }
    
}


async function main() {
    const deepSeekClient = new DeepSeekClient("demo");
    const agent = new Agent("hello",new EmptyLLMriable(),deepSeekClient);
    const result = await agent.run("write hello world in python",{});
    console.log(result.getText())
}

main();