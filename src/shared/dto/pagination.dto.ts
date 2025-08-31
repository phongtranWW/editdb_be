import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginationDto<T> {
  @ApiProperty({ description: 'Total number of elements' })
  total: number;

  @ApiProperty({ description: 'Elements of the page', isArray: true })
  data: T[];
}
