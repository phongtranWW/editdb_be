import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword, Length } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Email of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Name of the user' })
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsStrongPassword()
  password: string;
}
