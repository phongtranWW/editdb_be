export class CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  provider: {
    provider: string;
    providerId: string;
    hash?: string;
  }[];
  roles?: string[];
  isActive?: boolean;
}
