import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import B2 from 'backblaze-b2';

import { DatabaseException } from 'src/common/exceptions/database.exception';
import { inspect } from 'util';
import { Stream } from 'stream';

interface B2UploadFileResponseInterface {
  fileId: string;
  fileName: string;
  bucketId: string;
  contentLength: number;
  contentType: string;
  uploadTimestamp: number;
}

@Injectable()
export class CloudStorageService {
  private readonly b2: B2;
  private readonly logger = new Logger(CloudStorageService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.b2 = new B2({
      applicationKeyId: configService.get<string>('BACKBLAZE_APP_KEY_ID'),
      applicationKey: configService.get<string>('BACKBLAZE_APP_KEY'),
    });
  }

  downloadPrivateFile(fileId: string): Observable<Buffer> {
    return from(this.b2.authorize()).pipe(
      map((response) => {
        return response.data;
      }),
      switchMap((responseData) => {
        const urlDownloadFileById = `${responseData.downloadUrl}/b2api/v3/b2_download_file_by_id?fileId=${fileId}`;
        const headers = {
          Authorization: responseData.authorizationToken,
        };
        return this.httpService.get(urlDownloadFileById, {
          headers,
          responseType: 'arraybuffer',
        });
      }),
      map((response) => {
        return response.data;
      }),
      catchError((error) => {
        return throwError(
          () =>
            new DatabaseException(
              `Ошибка при загрузке файла: ${error.message}`,
            ),
        );
      }),
    );
  }

  uploadFile(
    bucketId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Observable<B2UploadFileResponseInterface> {
    return from(this.b2.authorize()).pipe(
      switchMap(() => {
        return from(this.b2.getUploadUrl({ bucketId }));
      }),
      switchMap((uploadUrlResponse) => {
        const uploadUrl: string = uploadUrlResponse.data.uploadUrl;
        const uploadAuthToken: string =
          uploadUrlResponse.data.authorizationToken;
        return this.performFileUpload(
          fileName,
          fileBuffer,
          mimeType,
          uploadAuthToken,
          uploadUrl,
        );
      }),
    );
  }

  private performFileUpload(
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
    uploadAuthToken: string,
    uploadUrl: string,
  ): Observable<B2UploadFileResponseInterface> {
    const uploadParams = {
      uploadUrl,
      uploadAuthToken,
      fileName,
      data: fileBuffer,
      contentType: mimeType,
    };

    return from(this.b2.uploadFile(uploadParams)).pipe(
      map((uploadResponse) => uploadResponse.data),
      catchError((error) => {
        return throwError(() => error);
      }),
    );
  }

  // deleteFile(fileId: string, fileName: string): Observable<void> {
  //   return from(this.b2.deleteFileVersion({ fileId, fileName })).pipe(
  //     map(() => {
  //       this.logger.log(`File successfully deleted.`);
  //     }),
  //     catchError((error) => {
  //       return throwError(() => error);
  //     }),
  //   );
  // }
}
