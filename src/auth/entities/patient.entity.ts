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
  apartment: string | null;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  house: string;

  @Column({ nullable: true })
  housing: string | null;

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
  apartment: string | null;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  house: string;

  @Column({ nullable: true })
  housing: string | null;

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

  @Column()
  mobilePhoneNumber: string;

  @Column()
  hashedPassword: string;
}

// Сущность IdentificationInfo для хранения идентификационных данных
@Entity('identification_info')
export class IdentificationInfo {
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

  @Column({ nullable: true })
  passportIssueDate: string | null;

  @Column({ nullable: true })
  passportIssuingAuthority: string | null;

  @Column({ nullable: true })
  passportSeriesNumber: string | null;

  @Column({ nullable: true })
  personalIdentificationNumber: string | null;

  @Column()
  userCitizenship: string;
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

  // Связь с таблицей AddressInfo для информации о регистрации
  @OneToOne(() => AddressRegistrationInfo, { cascade: true })
  @JoinColumn({ name: 'addressRegistrationInfoId' })
  addressRegistrationInfo: AddressRegistrationInfo;

  // Связь с таблицей AddressInfo для информации о месте жительства
  @OneToOne(() => AddressResidenceInfo, { cascade: true })
  @JoinColumn({ name: 'addressResidenceInfoId' })
  addressResidenceInfo: AddressResidenceInfo;

  // Связь с таблицей ContactInfo для информации о контактах (с хешированным паролем)
  @OneToOne(() => ContactInfo, { cascade: true })
  @JoinColumn({ name: 'contactInfoId' })
  contactInfo: ContactInfo;

  // Связь с таблицей IdentificationInfo для информации об идентификации
  @OneToOne(() => IdentificationInfo, { cascade: true })
  @JoinColumn({ name: 'identificationInfoId' })
  identificationInfo: IdentificationInfo;

  // Связь с таблицей PersonalInfo для персональной информации
  @OneToOne(() => PersonalInfo, { cascade: true })
  @JoinColumn({ name: 'personalInfoId' })
  personalInfo: PersonalInfo;
}
