# deepseekersTs
deepseekers 标准 TypeScript 版本

## 目标
- 让开发人员以最小的成本将 LLM-based 的逻辑引入到现有的系统或者应用中
- 提供了工具调用和结构化输出这样 LLM-based 应用必不可少功能的封装
- 提供开发一个多 Agent 应用的基础设施，易于扩展和维护

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
## 结构化输出

## 工具调用