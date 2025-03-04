import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, from, map, switchMap, throwError } from 'rxjs';
import B2 from 'backblaze-b2';

@Injectable()
export class BackblazeService {
  private apiUrl: string;
  private downloadUrl: string;
  private authToken: string;
  private readonly b2: B2;
  private readonly appKey = this.configService.get<string>('BACKBLAZE_APP_KEY');
  private readonly keyId = this.configService.get<string>(
    'BACKBLAZE_APP_KEY_ID',
  );
  private readonly logger = new Logger(BackblazeService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.b2 = new B2({
      applicationKeyId: this.keyId,
      applicationKey: this.appKey,
    });
  }

  // Авторизация в Backblaze B2
  authorize(): Observable<void> {
    const authUrl = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account';
    const authHeader = Buffer.from(`${this.keyId}:${this.appKey}`).toString(
      'base64',
    );

    return this.httpService
      .get(authUrl, { headers: { Authorization: `Basic ${authHeader}` } })
      .pipe(
        map((response) => {
          this.apiUrl = response.data.apiUrl;
          this.downloadUrl = response.data.downloadUrl;
          this.authToken = response.data.authorizationToken;
        }),
      );
  }

  //  Генерация приватной ссылки на скачивание файла
  getPrivatePhotoUrl(
    bucketId: string,
    fileName: string,
    bucketName: string,
  ): Observable<string> {
    if (!this.authToken) {
      return throwError(
        () => new HttpException('Not authorized', HttpStatus.FORBIDDEN),
      );
    }

    const endpoint = `${this.apiUrl}/b2api/v2/b2_get_download_authorization`;

    return this.httpService
      .post<{ authorizationToken: string }>(
        endpoint,
        {
          bucketId,
          fileNamePrefix: fileName,
          validDurationInSeconds: 3600,
        },
        {
          headers: { Authorization: this.authToken },
        },
      )
      .pipe(
        map((response) => {
          const authorizationToken = response.data.authorizationToken;
          return `${this.downloadUrl}/file/${bucketName}/${fileName}?Authorization=${authorizationToken}`;
        }),
      );
  }

  // Загрузка файла в облако
  uploadFile(
    bucketId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Observable<{ fileName: string }> {
    return from(this.b2.authorize()).pipe(
      switchMap(() => from(this.b2.getUploadUrl({ bucketId }))),
      switchMap((uploadUrlResponse) => {
        return from(
          this.b2.uploadFile({
            uploadUrl: uploadUrlResponse.data.uploadUrl,
            uploadAuthToken: uploadUrlResponse.data.authorizationToken,
            fileName,
            data: fileBuffer,
            mime: mimeType,
          }),
        );
      }),
      map((uploadResponse) => ({
        fileName: uploadResponse.data.fileName,
      })),
      switchMap((data) => {
        return from([data]);
      }),
    );
  }
}
