import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    description: 'Name of the user',
  })
  name: string;

  @ApiProperty({
    description: 'Avatar of the user',
  })
  avatar: string;

  @ApiProperty({
    description: 'Is the user active ?',
  })
  isActive: boolean;
}
