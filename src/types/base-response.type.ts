export type Meta = {
  page: number;
  total_page: number;
  total_data: number;
};

export type BaseResponse<T = unknown> = {
  message: string;
  data: T;
  meta?: Meta;
};



export type ResponseID = {
 id : number
};