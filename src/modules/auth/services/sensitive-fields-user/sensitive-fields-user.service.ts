import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AUTH_NOTIFICATIONS } from 'src/modules/auth/constants/auth-notification.constant';
import { DoctorEntity } from 'src/repositories/entities/doctor.entity';
import { PatientEntity } from 'src/repositories/entities/patient.entity';
import {
  PatientBaseResponseDto,
  DoctorBaseResponseDto,
} from 'src/modules/auth/dto/user-response.dto';

@Injectable()
export class SensitiveFieldsUserService {
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
