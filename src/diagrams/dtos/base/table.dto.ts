import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ColumnDto } from './column.dto';

export class TableDto {
  @ApiProperty({ description: 'Table id', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Table name', example: 'users' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Table columns',
    type: [ColumnDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnDto)
  columns: ColumnDto[];
}
