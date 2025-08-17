import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RelationshipType } from '../../types/relationship.type';

export class RelationshipDto {
  @ApiProperty({ description: 'Relationship id', example: '1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Relationship name', example: 'user_posts' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Source table name' })
  @IsOptional()
  @IsString()
  fromTable?: string;

  @ApiProperty({ description: 'Source column name' })
  @IsOptional()
  @IsString()
  fromColumn?: string;

  @ApiProperty({ description: 'Target table name', example: 'posts' })
  @IsOptional()
  @IsString()
  toTable?: string;

  @ApiProperty({ description: 'Target column name', example: 'user_id' })
  @IsOptional()
  @IsString()
  toColumn?: string;

  @ApiProperty({
    description: 'Relationship type',
    enum: RelationshipType,
    example: RelationshipType.ONE_TO_MANY,
  })
  @IsOptional()
  @IsEnum(RelationshipType)
  type?: RelationshipType;
}
