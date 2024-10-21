export interface GlobalSuccessResponseInterface<T> {
  statusCode: number;
  message: string;
  data: T;
}
