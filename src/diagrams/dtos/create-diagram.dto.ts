import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDiagramDto {
  @ApiProperty({
    description: 'The name of the diagram',
    example: 'Banking System',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, {
    message: 'Name is too long. Maximum length is $constraint1 characters',
  })
  @MinLength(3, {
    message: 'Name is too short. Minimum length is $constraint1 characters',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the diagram',
    example: 'This diagram shows the overall system architecture',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, {
    message:
      'Description is too long. Maximum length is $constraint1 characters',
  })
  description?: string;
}
