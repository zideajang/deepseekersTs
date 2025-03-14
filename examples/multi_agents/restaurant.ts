
import Agent from "../../deepseekers/src/agent/base";
import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';
import { functionToJsonSchema } from "../../deepseekers/src/utils";
import { BaseMessage, ToolMessage } from "../../deepseekers/src/message";
import { LLMWriter,EmptyLLMriable } from "../../deepseekers/src/types";
import * as readline from 'readline';

console.log("欢迎来到小店，提供各种美食");
let delivery:Delivery|null = null;
enum DishCategory{
    Appetizers = "开胃菜",
    MainCourses = "主菜",
    Desserts = "甜品"
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min); // 向上取整
    max = Math.floor(max); // 向下取整
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface Dish{
    category:DishCategory,
    name:string,
    price:number
}

class MainCoursesDish implements Dish{
    category: DishCategory;
    name: string;
    price: number;
    constructor(name:string,price:number){
        this.category = DishCategory.MainCourses;
        this.name = name;
        this.price = price
    }
    
}

class AppetizersDish implements Dish{
    category: DishCategory;
    name: string;
    price: number;
    constructor(name:string,price:number){
        this.category = DishCategory.Appetizers;
        this.name = name;
        this.price = price
    }
}

class DessertsDish implements Dish{
    category: DishCategory;
    name: string;
    price: number;
    constructor(name:string,price:number){
        this.category = DishCategory.Desserts;
        this.name = name;
        this.price = price
    }
    
}


const dishMenu:Dish[] = []
dishMenu.push(new MainCoursesDish("锅包肉",38.00));
dishMenu.push(new MainCoursesDish("地三鲜",28.00));
dishMenu.push(new MainCoursesDish("宫保鸡丁",32.00));
dishMenu.push(new MainCoursesDish("东北乱炖",32.00));

dishMenu.push(new DessertsDish("小甜汤",12.00));
dishMenu.push(new DessertsDish("玉米羹",8.00));
dishMenu.push(new DessertsDish("米糕(小份)",5.00));
dishMenu.push(new DessertsDish("米糕(大份)",8.00));

dishMenu.push(new AppetizersDish("凉拌黄瓜",8.00));
dishMenu.push(new AppetizersDish("皮蛋豆腐",12.50));
dishMenu.push(new AppetizersDish("炸花生米",18.00));

function generateRandomId(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
}

const deepSeekClient = new DeepSeekClient("deepseek-client");
const waitSystemMessage = `
您是一名饭店的服务员，名字叫张，协助顾客进行点餐，态度热情诚恳
<context>

这是一家连锁经营的店铺，是 12 号店铺，名字是zidea小店，招牌菜是锅包肉和地三鲜，可以推荐用户
</contex>
<insruction>
对于客户问题如果不了解，请回答好意思，例如你们老板是谁这样问题
</insruction>

提供了一些列的方法，
<tools>
showMenu() 向顾客展示菜单
show() 向顾客展示菜单
orderDish(dishName:string) 将客户点餐添加到订单
cancelDish(dishName:string) 将客户点餐添加到订单
</tools>
`

const deverilySystemMessage = `
您是一名送餐员，名字叫小李，负责将点餐送到客户

<insruction>
对于客户问题如果不了解，请回答好意思，例如你们老板是谁这样问题
</insruction>

提供了一些列的方法，
<tools>
showDeverilyState() 查看派送订单窗台
</tools>
`

const waiterAgent = new Agent(
    "waiter",
    new EmptyLLMriable(),
    waitSystemMessage,
    deepSeekClient,
    "deepseek-chat"
);
waiterAgent.bindTool(showMenu);
waiterAgent.bindTool(showOrder);
waiterAgent.bindTool(orderDish);
waiterAgent.bindTool(cancelDish);
waiterAgent.bindTool(startDelivery);


// 
class Order{
    id:string;
    dish:Dish[];
    totalPrice:number;
    constructor(){
        this.id = generateRandomId();
        this.dish = [];
        this.totalPrice =0.0
    }
    addDish(dish:Dish):string{
        this.dish.push(dish);
        this.totalPrice += dish.price;
        return `您刚刚点了 ${dish.name}。`;
    }
    removeDish(dish:Dish):string{
        const index = this.dish.findIndex(d => d.name === dish.name);
        if (index !== -1) {
            this.dish.splice(index, 1);
            this.totalPrice -= dish.price;
            return `已经帮您取消了 ${dish.name} 。`

        } else {
            return `您好，您要取消的菜品 ${dish.name} 并不在，无法取消。`
        }
    }
    showOrder():string{
        let orderedDishes = ""
        for (let index = 0; index < this.dish.length; index++) {
            if(index == this.dish.length - 1){
                orderedDishes += (this.dish[index].name) 
            }else{
                orderedDishes += (this.dish[index].name) + "、"
            }
            
        }
        return `到目前为止您已经点了 ${orderedDishes} 这些，请您核对,一共消费${this.totalPrice}`
    }
    cancelOrder():string{
        this.dish = [];
        this.totalPrice = 0;
        return `已经成功为您取消订单了`
    }
}

const order = new Order();

function orderDish(dishName:string):string{
    /**
     * 点菜将顾客点菜添加到订单中
     * dishName:string:required:点菜名称
     */
    console.log(`开始下单${dishName}`)
    console.log(`开始下单${dishMenu.length}`)
    const foundDish = dishMenu.find(dish=> dish.name == dishName);
    console.log(`完成${foundDish}下单`)
    if (foundDish){
        return order.addDish(foundDish)
    }else{
        return `暂时饭店还没有提供 ${dishName}`
    }
}

function cancelDish(dishName:string):string{
    /**
     * 取消已经点的菜
     * dishName:string:required:点菜名称
     */
    const foundDish = dishMenu.find((dish)=> dish.name === dishName);
    if (foundDish){
        return order.removeDish(foundDish)
    }else{
        return `暂时饭店还没有提供 ${dishName}`
    }
}

enum DeliveryStatus {
    PENDING = "待派送",
    IN_PROGRESS = "派送中",
    COMPLETED = "完成派送",
}

class Delivery {
    private status: DeliveryStatus;

    constructor() {
        this.status = DeliveryStatus.PENDING; // 初始状态为待派送
    }

    // 获取当前状态
    getStatus(): DeliveryStatus {
        return this.status;
    }

    // 开始派送
    startDelivery(): void {
        if (this.status === DeliveryStatus.PENDING) {
            this.status = DeliveryStatus.IN_PROGRESS;
            console.log("派送已开始。");
        } else {
            console.log("无法开始派送：当前状态不是待派送。");
        }
    }

    // 完成派送
    completeDelivery(): void {
        if (this.status === DeliveryStatus.IN_PROGRESS) {
            this.status = DeliveryStatus.COMPLETED;
            console.log("派送已完成。");
        } else {
            console.log("无法完成派送：当前状态不是派送中。");
        }
    }
}

function showDeverilyState():string{
    /**
     * 查看派送订单状态和进度
     */
    
    if(delivery?.getStatus() == DeliveryStatus.PENDING){
        const randomInt = getRandomInt(1, 3);
        if (randomInt == 1){
            delivery?.startDelivery()
        }
    }

    if(delivery?.getStatus() == DeliveryStatus.IN_PROGRESS){
        const randomInt = getRandomInt(1, 6);
        if (randomInt == 6){
            delivery?.completeDelivery()
        }
    }
    
    return `当前状态:, ${delivery?.getStatus()}`; 
}

function showMenu(){
    /**
     * 查看菜单
     */
    for (let index = 0; index < dishMenu.length; index++) {
        console.log(`菜名🍛${dishMenu[index].name}:价格${dishMenu[index].price}`)
    }
    return null;
}

function showOrder(){
    /**
     * 查看账单(订单)
     */
    console.log(`🗒️${order.showOrder()}`)
    return null;
}

function cancelOrder(){
    /**
     * 去掉(订单)
     */
    console.log(`🗒️${order.showOrder()}`)
    return null;
}



function startDelivery():string{
    /**
     * 开始派送送餐
     */
    delivery = new Delivery();
    // delivery.startDelivery();
    waiterAgent.reset();
    waiterAgent.updateSystemMessage({role:'system',content:deverilySystemMessage});
    waiterAgent.bindTool(showDeverilyState);

    return `开始下单${order.showOrder()}`
}

async function main(){
    // 初始化一个 Client 提供调用远程 deepseek 的客户端，扩展其他 LLM 供应商提供的服务
    
    // 初始化一个 Agent
    // TODO 将 any 替换限制类型
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

    // console.log(waiterAgent.tools)
    // const result = await waiterAgent.run("点一个锅包肉",{});
    // console.log((result.getMessage() as BaseMessage[])[0].content)
    // console.log((result.getMessage() as ToolMessage[])[0].tool_name)
    // console.log((result.getMessage() as ToolMessage[])[0].tool_arguments);
    
      while (true) {
        const userInput = await new Promise<string>((resolve) => {
            rl.question('你: ', (input) => {
              resolve(input);
            });
        });
        
        if (userInput.toLowerCase() === 'exit') {
            console.log('欢迎下次光临');
            break;
        }
        if (userInput.toLowerCase() === 'order'){
            showOrder()
        }
        for (let index = 0; index < waiterAgent.messages.length; index++) {
            const message = waiterAgent.messages[index] as BaseMessage;
            console.log('\x1b[36m%s\x1b[0m',`${message.role}\n:${message.content}`)
        }
        const result = await waiterAgent.run(userInput,{});

        const messages = result.getMessage() as BaseMessage[]
        const message = messages[0] as BaseMessage;
        if (message.role === 'assistant'){
            waiterAgent.addMessage(message);
            console.log(`🤖: ${message.content}`)
        }else if(message.role === 'tool'){
            const toolMessage:ToolMessage= (result.getMessage() as ToolMessage[])[0];
            const args = Object.values(JSON.parse(toolMessage.tool_arguments));
            console.log(`⚙️: 调用工具${toolMessage.tool_name}(${args})`)
            // console.log(args)
            const resultCallTool = waiterAgent.toolMap[toolMessage.tool_name](...args);
            if(resultCallTool){
                if(typeof resultCallTool === 'string'){
                    console.log(`🤖: ${resultCallTool}`);
                    waiterAgent.addMessage({role:'assistant',content:`调用${toolMessage.tool_name}工具得到返回值为${result}`})
                }
            }else{
                waiterAgent.messages.pop();
            }
        }

      }

      rl.close();
    
   
}

main();

