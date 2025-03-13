import Agent from "../../deepseekers/src/agent/base";
import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';

function say_hello(name:string):string{
    return `say ${name}`
}

function main(){
    const deepSeekClient = new DeepSeekClient("demo");
    const agent = new Agent("hello",deepSeekClient);

    agent.tool(say_hello)
    const result = say_hello("tony");
    console.log(result);

    
    // const result = await agent.run("write hello world in python",{});
    // console.log(result.getText())
    // console.log(result.getData())
}

main();