import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ColumnDataType } from '../types/column-data.type';

export class ColumnDto {
  @ApiProperty({ description: 'Column name', example: 'id' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Column data type',
    enum: ColumnDataType,
    example: ColumnDataType.INTEGER,
  })
  @IsEnum(ColumnDataType)
  type: ColumnDataType;

  @ApiProperty({ description: 'Is primary key', example: false })
  @IsBoolean()
  isPrimary: boolean;

  @ApiProperty({ description: 'Is unique', example: false })
  @IsBoolean()
  isUnique: boolean;

  @ApiProperty({ description: 'Is nullable', example: true })
  @IsBoolean()
  isNullable: boolean;

  @ApiPropertyOptional({ description: 'Default value', example: null })
  @IsString()
  @IsOptional()
  default?: string;
}
