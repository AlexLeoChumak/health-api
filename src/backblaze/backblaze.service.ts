import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

@Injectable()
export class BackblazeService {
  private apiUrl: string;
  private downloadUrl: string;
  private authToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  authorize(): Observable<void> {
    const authUrl = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account';
    const appKey = this.configService.get<string>('BACKBLAZE_APP_KEY');
    const keyId = this.configService.get<string>('BACKBLAZE_APP_KEY_ID');
    const authHeader = Buffer.from(`${keyId}:${appKey}`).toString('base64');

    return this.httpService
      .get(authUrl, {
        headers: { Authorization: `Basic ${authHeader}` },
      })
      .pipe(
        map((response) => {
          this.apiUrl = response.data.apiUrl;
          this.downloadUrl = response.data.downloadUrl;
          this.authToken = response.data.authorizationToken;
        }),
      );
  }

  getPrivatePhotoUrl(
    bucketId: string,
    fileName: string,
    bucketName: string,
  ): Observable<string> {
    if (!this.downloadUrl || !this.authToken) {
      throw new HttpException('Not authorized', HttpStatus.FORBIDDEN);
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
          headers: {
            Authorization: this.authToken,
          },
        },
      )
      .pipe(
        map((response) => {
          const authorizationToken = response.data.authorizationToken;
          return `${this.downloadUrl}/file/${bucketName}/${fileName}?Authorization=${authorizationToken}`;
        }),
      );
  }
}
