import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Visibility } from 'src/diagrams/types/visibility.type';

export class UpdateShareSettingsDto {
  @ApiProperty({
    description: 'Diagram visibility',
    enum: Visibility,
  })
  @IsEnum(Visibility)
  visibility: Visibility;
}
