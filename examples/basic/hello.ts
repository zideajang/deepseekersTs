import Agent from "../../deepseekers/src/agent/base";
import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';


async function main() {
    const deepSeekClient = new DeepSeekClient("demo");
    const agent = new Agent("hello",deepSeekClient);
    const result = await agent.run("write hello world in python",{});
    console.log(result.getText())
    // console.log(result.getData())
}

main();