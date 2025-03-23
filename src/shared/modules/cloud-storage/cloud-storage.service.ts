import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Observable, from, map, switchMap, throwError } from 'rxjs';
import B2 from 'backblaze-b2';
import { PhotoUserProfileInterface } from 'src/shared/modules/cloud-storage/models/photo-user-profile.interface';
import { SHARED_CONSTANT } from 'src/common/constants/shared.constant';

@Injectable()
export class CloudStorageService {
  private readonly keyId: string;
  private readonly appKey: string;
  private readonly b2: B2;
  private apiUrl: string;
  private downloadUrl: string;
  private authToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.keyId = this.configService.get<string>('BACKBLAZE_APP_KEY_ID');
    this.appKey = this.configService.get<string>('BACKBLAZE_APP_KEY');

    this.b2 = new B2({
      applicationKeyId: this.keyId,
      applicationKey: this.appKey,
    });
  }

  private authorize(): Observable<void> {
    return from(this.b2.authorize()).pipe(
      map((response) => {
        this.apiUrl = response.data.apiUrl;
        this.downloadUrl = response.data.downloadUrl;
        this.authToken = response.data.authorizationToken;
      }),
    );
  }

  public getPrivatePhotoUrl(
    bucketId: string,
    fileName: string,
    bucketName: string,
  ): Observable<string> {
    return this.authorize().pipe(
      switchMap(() => {
        if (!this.apiUrl || !this.authToken) {
          return throwError(
            () => new ForbiddenException(SHARED_CONSTANT.FORBIDDEN_EXCEPTION),
          );
        }

        const endpoint = `${this.apiUrl}/b2api/v2/b2_get_download_authorization`;

        return this.httpService.post<{ authorizationToken: string }>(
          endpoint,
          { bucketId, fileNamePrefix: fileName, validDurationInSeconds: 3600 },
          { headers: { Authorization: this.authToken } },
        );
      }),
      map((response) => {
        const authorizationToken = response.data.authorizationToken;
        return `${this.downloadUrl}/file/${bucketName}/${fileName}?Authorization=${authorizationToken}`;
      }),
    );
  }

  public uploadUserPhoto(
    bucketId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Observable<PhotoUserProfileInterface> {
    return this.authorize().pipe(
      switchMap(() => from(this.b2.getUploadUrl({ bucketId }))),
      switchMap(({ data: { uploadUrl, authorizationToken } }) =>
        from(
          this.b2.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName,
            data: fileBuffer,
            mime: mimeType,
          }),
        ),
      ),
      map(({ data }) => ({ fileName: data.fileName, fileId: data.fileId })),
    );
  }

  public deletePhoto(fileName: string, fileId: string): Observable<void> {
    return this.authorize().pipe(
      switchMap(() => {
        if (!this.authToken) {
          return throwError(
            () => new ForbiddenException(SHARED_CONSTANT.FORBIDDEN_EXCEPTION),
          );
        }

        return from(
          this.b2.deleteFileVersion({
            fileId,
            fileName,
          }),
        );
      }),
      map(() => void 0),
    );
  }
}
