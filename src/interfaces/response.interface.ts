interface Response {
  success: boolean;
  timestamp: number;
}

export interface ResponseSuccess extends Response {
  data: any;
}

export interface ResponseError extends Response {
  message: string;
  errors: string | Record<string, any>;
}
