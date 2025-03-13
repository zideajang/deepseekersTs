import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import OpenAI from "openai";

import { Client } from './base'; 
// 获取 deepseek API key
interface DeepSeekConfig {
  DEEPSEEK_API_KEY: string;
}

// client 接口

function getConfig(): DeepSeekConfig {
  try {
    const configPath = "D:\\config.yaml"; 
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const config = yaml.load(fileContents) as DeepSeekConfig;
    return config;
  } catch (e) {
    console.error('Error loading config:', e);
    throw e; // 或者返回一个默认配置，或者返回null，根据你的需求来。
  }
}

const config = getConfig();
const DEEPSEEK_API_KEY = config.DEEPSEEK_API_KEY;
const DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

export interface ChatConfig {
    messages: { role: string; content: string }[];
    model: string;
    // 可以根据需要添加其他配置项
}


export class DeepSeekClient implements Client {
    name: string;
    apiKey: string;
    baseUrl: string;
    openai:OpenAI;
  
    constructor(name: string,
      apiKey:string=DEEPSEEK_API_KEY,
      baseUrl:string=DEEPSEEK_BASE_URL) {
        this.name = name;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;

        this.openai = new OpenAI({
            baseURL: this.baseUrl,
            apiKey: this.apiKey
        });
    }
    async chat(config: any): Promise<any> {
        const response = await this.openai.chat.completions.create(config);
        return response
    }
}

