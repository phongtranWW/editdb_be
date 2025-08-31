import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableDto } from './table.dto';
import { RelationshipDto } from './relationship.dto';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DatabaseType } from 'src/diagrams/types/database.type';

export class BaseDiagramDto {
  @ApiProperty({ description: 'Diagram name', example: 'ERD v2' })
  @IsString()
  @IsOptional()
  name: string;

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

  @ApiPropertyOptional({
    description: 'Database type',
    enum: DatabaseType,
    example: DatabaseType.MYSQL,
  })
  @IsString()
  @IsOptional()
  type: DatabaseType;
}
