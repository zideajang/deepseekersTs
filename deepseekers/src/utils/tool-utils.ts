
export function functionToJsonSchema(code: string): any {
    const regex = /\/\*\*\s*\n([\s\S]*?)\n\s*\*\//;
    const match = code.match(regex);
  
    if (!match) {
      return null; // 没有找到 JSDoc 注释
    }
  
    const comment = match[1];
    const lines = comment.split('\n').map(line => line.trim().replace(/^\*/, '').trim());
  
    const functionDescription = lines[0];

    const parameters: any = {
      type: 'object',
      properties: {},
      required: []
    };
  
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const parts = line.split(':');
      if (parts.length === 4) {
        const [name, type, required,description] = parts.map(part => part.trim());
        parameters.properties[name] = {
          type: type,
          description: description,
        };
        parameters.required.push(name)
      }
      if (parts.length === 3) {
        const [name, type, description] = parts.map(part => part.trim());
        parameters.properties[name] = {
          type: type,
          description: description,
        };
      }
    }
    const functionNameRegex = /function\s+(\w+)\s*\(/;
    const functionNameMatch = code.match(functionNameRegex);
    const functionName = functionNameMatch ? functionNameMatch[1] : 'anonymous';
  
    return {
      type: 'function',
      function: {
        name: functionName,
        description: functionDescription,
        parameters: parameters,
      },
    };
  }