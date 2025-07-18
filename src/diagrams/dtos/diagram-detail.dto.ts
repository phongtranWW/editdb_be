import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TableDto } from './table.dto';
import { RelationshipDto } from './relationship.dto';

export class DiagramDetailDto {
  @ApiProperty({ description: 'Unique identifier of the diagram' })
  id: string;

  @ApiProperty({ description: 'Diagram name', example: 'ERD v2' })
  name: string;

  @ApiPropertyOptional({
    description: 'Diagram description',
    example: 'Updated database schema',
  })
  description?: string;

  @ApiProperty({
    description: 'Tables in diagram',
    type: [TableDto],
  })
  tables: TableDto[];

  @ApiProperty({
    description: 'Relationships between tables',
    type: [RelationshipDto],
  })
  relationships: RelationshipDto[];
}
