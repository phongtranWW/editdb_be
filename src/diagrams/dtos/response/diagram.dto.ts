import { ApiProperty } from '@nestjs/swagger';
import { BaseDiagramDto } from '../base/base-diagram.dto';
import { Visibility } from 'src/diagrams/types/visibility.type';

export class DiagramDto extends BaseDiagramDto {
  @ApiProperty({ description: 'Diagram id', example: '1' })
  id: string;

  @ApiProperty({
    description: 'Diagram visibility',
    enum: Visibility,
  })
  visibility: Visibility;

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
