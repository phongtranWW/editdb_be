import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class PositionDto {
  @ApiProperty({ description: 'X coordinate', example: 100 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Y coordinate', example: 200 })
  @IsNumber()
  y: number;
}
