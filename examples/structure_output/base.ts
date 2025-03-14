import Agent from "../../deepseekers/src/agent/base";
import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';
import { functionToJsonSchema } from "../../deepseekers/src/utils";
import { ToolMessage } from "../../deepseekers/src/message";
import { LLMWritable, LLMWriter,EmptyLLMriable } from "../../deepseekers/src/types";

class Pizza{
    name:string
    description:string
    constructor(name:string,description:string){
        this.name = name
        this.description = description
    }
}

class PizzaList{
    pizzaList:Pizza[]
    constructor(pizzaList:Pizza[]){
        this.pizzaList = pizzaList
    }

}

const LLMWritablePizzaList =  LLMWritable(PizzaList,"给出pizza列表")

const pizzaOne = new Pizza("玛格丽塔披萨","经典的意大利披萨，配料包括番茄、马苏里拉奶酪和罗勒。")
const pizzaTwo = new Pizza("意大利辣香肠披萨","披萨上铺有意大利辣香肠片和奶酪。")
const pizzaList = new LLMWritablePizzaList([pizzaOne,pizzaTwo])

// new (pizzaList: Pizza[]) => LLMWritable<typeof PizzaList>




async function main(){
    // 初始化一个 Client 提供调用远程 deepseek 的客户端，扩展其他 LLM 供应商提供的服务
    const deepSeekClient = new DeepSeekClient("demo");
    // 初始化一个 Agent
    // TODO 将 any 替换限制类型
    const agent = new Agent<any,any>(
        "weatherForcastAgent",
        pizzaList,
        deepSeekClient);
    // agent 绑定函数
    // 运行 agent
    const result = await agent.run("生成 10 披萨数据",{});
    const pizzaListResult:PizzaList = result.getData() as PizzaList;
    console.log(pizzaListResult)
    console.log("---------------------")
    for (let index = 0; index < pizzaListResult.pizzaList.length; index++) {
        const pizza:Pizza = pizzaListResult.pizzaList[index];
        console.log(`${pizza.name}`)
        console.log(`${pizza.description}`)
        
    }
   
}

main();