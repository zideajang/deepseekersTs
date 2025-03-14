export function printJsonString(jsonObj:any){

    const jsonString = JSON.stringify(jsonObj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            return value; // 返回数组本身
          } else {
            return value; // 返回对象本身
          }
        }
        return value;
      }, 2);

    console.log(jsonString);
    return jsonString
}
