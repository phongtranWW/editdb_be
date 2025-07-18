import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DiagramDto {
  @ApiProperty({
    description: 'Unique identifier of the diagram',
    example: '60d5f9f8f9b1a9f3f0b9b1a9',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the diagram',
    example: 'System Architecture Diagram',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Optional description of the diagram',
    example: 'This diagram shows the overall system components',
    required: false,
  })
  description?: string;
}
