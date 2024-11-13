export interface GlobalSuccessResponseInterface<T> {
  statusCode: number;
  message: string | null;
  data: T | null;
}
