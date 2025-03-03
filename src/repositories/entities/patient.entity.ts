import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

// Сущность AddressInfo для хранения данных об адресах
@Entity('address_registration_info')
export class AddressRegistrationInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  apartment: number | null;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  house: number;

  @Column({ nullable: true })
  housing: number | null;

  @Column()
  region: string;

  @Column()
  street: string;
}

@Entity('address_residence_info')
export class AddressResidenceInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  apartment: number | null;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  house: number;

  @Column({ nullable: true })
  housing: number | null;

  @Column()
  region: string;

  @Column()
  street: string;
}

// Сущность ContactInfo для хранения данных о контактах
@Entity('contact_info')
export class ContactInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  homePhoneNumber: string | null;
}

@Entity('mobile_phone_number_password_info')
export class MobilePhoneNumberPasswordInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mobilePhoneNumber: string;

  @Column()
  hashedPassword: string;
}

// Сущность IdentificationBelarusCitizenInfo для хранения идентификационных данных гражданина Беларуси
@Entity('identification_belarus_citizen_info')
export class IdentificationBelarusCitizenInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  passportIssueDate: string | null;

  @Column({ nullable: true })
  passportIssuingAuthority: string | null;

  @Column({ nullable: true })
  passportSeriesNumber: string | null;

  @Column({ nullable: true })
  personalIdentificationNumber: string | null;
}

// Сущность IdentificationForeignCitizenInfo для хранения идентификационных данных иностранного гражданина
@Entity('identification_foreign_citizen_info')
export class IdentificationForeignCitizenInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  documentName: string | null;

  @Column({ nullable: true })
  documentNumber: string | null;

  @Column({ nullable: true })
  healthInsuranceContractNumber: string | null;

  @Column({ nullable: true })
  nameInsuranceCompany: string | null;

  @Column({ nullable: true })
  nameStateForeignCitizen: string | null;
}

// Сущность PersonalInfo для хранения персональных данных
@Entity('personal_info')
export class PersonalInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  dateOfBirth: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string | null;

  @Column()
  gender: string;

  @Column({ nullable: true })
  photo: string | null;
}

// Сущность Patient, включающая все связи
@Entity('patients')
export class PatientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  refreshToken: string | null;

  // Связь с таблицей AddressInfo для информации о регистрации
  @OneToOne(() => AddressRegistrationInfo, { cascade: true })
  @JoinColumn({ name: 'addressRegistrationInfoId' })
  addressRegistrationInfo: AddressRegistrationInfo;

  // Связь с таблицей AddressInfo для информации о месте жительства
  @OneToOne(() => AddressResidenceInfo, { cascade: true })
  @JoinColumn({ name: 'addressResidenceInfoId' })
  addressResidenceInfo: AddressResidenceInfo;

  // Связь с таблицей ContactInfo для информации о контактах
  @OneToOne(() => ContactInfo, { cascade: true })
  @JoinColumn({ name: 'contactInfoId' })
  contactInfo: ContactInfo;

  @OneToOne(() => MobilePhoneNumberPasswordInfo, { cascade: true })
  @JoinColumn({ name: 'mobilePhoneNumberPasswordInfoId' })
  mobilePhoneNumberPasswordInfo: MobilePhoneNumberPasswordInfo;

  @OneToOne(() => IdentificationBelarusCitizenInfo, { cascade: true })
  @JoinColumn({ name: 'identificationBelarusCitizenInfoId' })
  identificationBelarusCitizenInfo: IdentificationBelarusCitizenInfo;

  @OneToOne(() => IdentificationForeignCitizenInfo, { cascade: true })
  @JoinColumn({ name: 'identificationForeignCitizenInfoId' })
  identificationForeignCitizenInfo: IdentificationForeignCitizenInfo;

  // Связь с таблицей PersonalInfo для персональной информации
  @OneToOne(() => PersonalInfo, { cascade: true })
  @JoinColumn({ name: 'personalInfoId' })
  personalInfo: PersonalInfo;
}
