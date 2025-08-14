import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RelationshipType } from '../types/relationship.type';

export class RelationshipDto {
  @ApiProperty({ description: 'Relationship id', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Relationship name', example: 'user_posts' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Source table name', example: 'users' })
  @IsString()
  @IsNotEmpty()
  fromTable: string;

  @ApiProperty({ description: 'Source column name', example: 'id' })
  @IsString()
  @IsNotEmpty()
  fromColumn: string;

  @ApiProperty({ description: 'Target table name', example: 'posts' })
  @IsString()
  @IsNotEmpty()
  toTable: string;

  @ApiProperty({ description: 'Target column name', example: 'user_id' })
  @IsString()
  @IsNotEmpty()
  toColumn: string;

  @ApiProperty({
    description: 'Relationship type',
    enum: RelationshipType,
    example: RelationshipType.ONE_TO_MANY,
  })
  @IsEnum(RelationshipType)
  type: RelationshipType;
}
