# deepseekersTs
deepseekers 标准 TypeScript 版本

![这是图片](/images/cover.jpg "TS 版本")

## Hello World
```ts
import Agent from "../../deepseekers/src/agent/base";
import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';


async function main() {
    const deepSeekClient = new DeepSeekClient("demo");
    const agent = new Agent("hello",deepSeekClient);
    const result = await agent.run("write hello world in python",{});
    console.log(result.getText())
}

main();
```