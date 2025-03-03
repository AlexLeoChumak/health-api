import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  PatientBaseResponseDto,
  DoctorBaseResponseDto,
} from 'src/auth/dto/user-response.dto';
import { DoctorEntity } from 'src/repositories/entities/doctor.entity';
import { PatientEntity } from 'src/repositories/entities/patient.entity';
import { AUTH_NOTIFICATIONS } from 'src/auth/constants/auth-notification.constant';

@Injectable()
export class SensitiveFieldsUserService {
  private readonly logger = new Logger();

  public removeSensitiveFieldsFromUser(
    user: PatientEntity | DoctorEntity,
  ): PatientBaseResponseDto | DoctorBaseResponseDto {
    if (typeof user !== 'object') {
      throw new InternalServerErrorException(
        AUTH_NOTIFICATIONS.USER_NOT_FOUND_ERROR,
      );
    }

    const filteredObj = {};
    const skipFields = ['hashedPassword', 'refreshToken'];

    for (const [field, value] of Object.entries(user)) {
      if (skipFields.includes(field) || value === undefined) {
        continue;
      }

      if (typeof value === 'object' && value !== null) {
        const nested = this.removeSensitiveFieldsFromUser(value);

        if (nested && Object.keys(nested).length > 0) {
          filteredObj[field] = nested;
        }
      } else {
        filteredObj[field] = value;
      }
    }

    return filteredObj as PatientBaseResponseDto | DoctorBaseResponseDto;
  }
}
