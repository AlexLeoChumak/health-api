export interface B2UploadFileResponseInterface {
  fileId: string;
  fileName: string;
  bucketId: string;
  contentLength: number;
  contentType: string;
  uploadTimestamp: number;
}
