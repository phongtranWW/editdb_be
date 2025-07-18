import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RelationshipDto } from './relationship.dto';
import { TableDto } from './table.dto';

export class UpdateDiagramDto {
  @ApiProperty({ description: 'Diagram name', example: 'ERD v2' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Diagram description',
    example: 'Updated database schema',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Tables in diagram',
    type: [TableDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TableDto)
  tables: TableDto[];

  @ApiProperty({
    description: 'Relationships between tables',
    type: [RelationshipDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RelationshipDto)
  relationships: RelationshipDto[];
}
