export default class ResponseOrError {
    response: any | null = null;
    error: Error | null = null;
  
    private constructor(response: any | null, error: Error | null) {
      this.response = response;
      this.error = error;
    }
  
    static from_response(response: any): ResponseOrError {
      return new ResponseOrError(response, null);
    }
  
    static from_error(error: Error): ResponseOrError {
      return new ResponseOrError(null, error);
    }
  
    is_ok(): boolean {
      return this.response !== null;
    }
  
    unwrap(): any {
      if (this.response === null) {
        throw new Error("Cannot unwrap an error.");
      }
      return this.response;
    }
  }
  
  export { ResponseOrError };