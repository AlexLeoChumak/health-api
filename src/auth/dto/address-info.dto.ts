import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class AddressInfoDto {
  @IsNumber() @IsOptional() apartment: number | null;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() district: string;
  @IsNumber() @IsNotEmpty() house: number;
  @IsNumber() @IsOptional() housing: number | null;
  @IsString() @IsNotEmpty() region: string;
  @IsString() @IsNotEmpty() street: string;
}
