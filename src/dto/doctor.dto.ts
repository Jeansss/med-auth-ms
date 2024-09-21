import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DoctorDTO {
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly cpf: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly crm: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly specialty: string;
}
