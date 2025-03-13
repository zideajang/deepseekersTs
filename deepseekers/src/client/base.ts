

export interface Client {
    name: string;
    apiKey: string;
    baseUrl: string;
    chat(config: any): Promise<any>; 
}
