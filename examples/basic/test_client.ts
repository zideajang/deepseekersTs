import { DeepSeekClient } from '../../deepseekers/src/client/deepseek-client';

async function main() {
    const deepSeekClient = new DeepSeekClient("demo");

    const chatConfig = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: "user", content: "hello"}
        ],
        model: 'deepseek-chat',
      };
    try {
        const response = await deepSeekClient.chat(chatConfig);
        console.log('DeepSeek response:', response.choices[0].message.content);
      } catch (error) {
        console.error('Error:', error);
      }
}

main()