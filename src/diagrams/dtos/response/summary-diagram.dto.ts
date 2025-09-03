import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DatabaseType } from 'src/diagrams/types/database.type';

export class SummaryDiagramDto {
  @ApiProperty({ description: 'Diagram id', example: '1' })
  id: string;

  @ApiProperty({ description: 'Diagram name', example: 'ERD v2' })
  name: string;

  @ApiProperty({
    description: 'Database type',
    enum: DatabaseType,
    example: DatabaseType.MYSQL,
  })
  type: DatabaseType;

  @ApiPropertyOptional({
    description: 'Diagram description',
    example: 'Updated database schema',
  })
  description?: string;

  @ApiProperty({
    description: 'Diagram creation date',
    example: '2022-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Diagram update date',
    example: '2022-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
