import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableDto } from './table.dto';
import { RelationshipDto } from './relationship.dto';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseDiagramDto {
  @ApiProperty({ description: 'Diagram name', example: 'ERD v2' })
  @IsString()
  @IsOptional()
  name: string;

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
  @ValidateNested({ each: true })
  @Type(() => TableDto)
  tables: TableDto[];

  @ApiProperty({
    description: 'Relationships between tables',
    type: [RelationshipDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelationshipDto)
  relationships: RelationshipDto[];
}
