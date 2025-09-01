import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ColumnDto {
  @ApiProperty({ description: 'Column id', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Column name', example: 'id' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Column data type',
    example: 'VARCHAR(50)',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Is primary key', example: false })
  @IsBoolean()
  isPrimary: boolean;

  @ApiProperty({ description: 'Is unique', example: false })
  @IsBoolean()
  isUnique: boolean;

  @ApiProperty({ description: 'Is nullable', example: true })
  @IsBoolean()
  isNullable: boolean;
}
